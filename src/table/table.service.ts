import { TableWithIdDto } from './dto/table.dto';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { DbService } from '../common/db/db.service';
import { UserDto, UserWithIdDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bull';
import { EventService } from 'src/event/event.service';

@Injectable()
export class TableService {
  constructor(
    private dbService: DbService,
    @InjectQueue('table') private readonly tableQueue: Queue,
    private readonly eventService: EventService,
  ) {}

  async getAll(): Promise<TableWithIdDto[]> {
    try {
      const tables = await this.dbService.query('tables', 'tableNumber');
      return tables;
    } catch (err) {
      throw err;
    }
  }

  async update(table: TableWithIdDto): Promise<void> {
    const { id } = table;
    delete table.id;
    try {
      await this.dbService.update('tables', id, table);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dbService.delete('tables', id);
    } catch (err) {
      throw err;
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.dbService.deleteAll('tables');
      await this.dbService.deleteAll('uuids');
    } catch (err) {
      throw err;
    }
  }

  async joinTable(user: UserWithIdDto): Promise<string> {
    console.log('entered join table');
    const { portfolioStage } = user;
    delete user.portfolioStage;
    console.log('Getting Tables and Events');
    const tables = await this.getAll();
    const events = await this.eventService.findAll();
    console.log(
      `Looking For Table with portfolioStage: ${portfolioStage} in event: ${user.eventId}`,
    );
    const event = events.find((event) => event.id === user.eventId);
    const table = tables.find(
      (arrayTable) =>
        arrayTable.portfolioStage === portfolioStage &&
        arrayTable.users.length < 3,
    );
    console.log(tables);
    let tableId = table?.id;

    if (!tableId) {
      console.log(
        `Table not found for ${portfolioStage} setting new table number`,
      );
      const tableNumber = event.tableIds ? event.tableIds.length + 1 : 1;

      const newTable = {
        users: [user],
        portfolioStage,
        tableNumber,
      };
      console.log(`New Table ${JSON.stringify(newTable)}`);
      tableId = await this.dbService.add('tables', newTable);
    } else {
      table.users.push(user);
      console.log(`Updating Table ${JSON.stringify(table)}`);
      delete table.id;
      await this.dbService.update('tables', tableId, table);
    }
    await this.eventService.update(user.eventId, {
      ...event,
      tableIds: [...event.tableIds, tableId],
    });
    await this.dbService.update('uuids', user.id, tableId);
    console.log('exited join table');
    return tableId;
  }

  async createJoinTableRequest(user: UserDto) {
    const requestId = uuidv4();
    await this.tableQueue.add(
      'join-table',
      { ...user, id: requestId },
      { removeOnComplete: true },
    );
    console.log(`Created Join Table Request ${requestId}`);
    return requestId;
  }
}
