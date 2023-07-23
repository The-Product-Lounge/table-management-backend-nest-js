import { TableWithIdDto } from './dto/table.dto';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { DbService } from '../common/db/db.service';
import { UserDto, UserWithIdDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bull';
import { EventService } from 'src/event/event.service';
import { UpdateEventDto } from 'src/event/dto/update-event.dto';

@Injectable()
export class TableService {
  constructor(
    private dbService: DbService,
    @InjectQueue('table') private readonly tableQueue: Queue,
    private readonly eventService: EventService,
  ) {}

  async failed(user: UserWithIdDto) {
    await this.dbService.update(`uuids/${user.eventId}`, user.id, 'error');
  }

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

  async removeUserFromTable(table: TableWithIdDto): Promise<void> {
    await this.dbService.update('tables', table.id, table);
    const event = (await this.eventService.findOne(table.eventId)) as any;
    const eventUpdate = { ...event };
    eventUpdate.loungersNum = event.loungersNum ? event.loungersNum - 1 : 0;
    this.eventService.update(table.eventId, eventUpdate);
    await this.dbService.delete(`uuids/${table.eventId}`, table.userId);
  }

  async delete(id: string): Promise<void> {
    try {
      const table = (await this.dbService.simpleQuery(`tables/${id}`)) as any;
      const event = (await this.eventService.findOne(table.eventId)) as any;
      const eventUpdate = { ...event };
      // console.log(table);
      eventUpdate.loungersNum = event.loungersNum
        ? event.loungersNum - table.users.length
        : 0;
      eventUpdate.tableIds = event.tableIds.filter((tableId) => tableId !== id);
      await Promise.all(
        table.users.map(async (user) => {
          await this.dbService.delete(`uuids/${table.eventId}`, user.id);
        }),
      );
      await this.eventService.update(table.eventId, eventUpdate);

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
    const event = (await this.eventService.findOne(user.eventId)) as any;
    console.log(
      `Looking For Table with portfolioStage: ${portfolioStage} in event: ${user.eventId}`,
    );
    if (!event) {
      throw new Error(`Event ${user.eventId} not found`);
    }

    const eventId = user.eventId;

    const tempUser = { ...user };
    delete user.eventId;
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
      let tableNumber;
      for (let index = 0; index < tables.length; index++) {
        const table = tables[index];
        if (table?.tableNumber !== index + 1) {
          tableNumber = index + 1;
          break;
        }
      }
      if (!tableNumber)
        tableNumber = event.tableIds ? event.tableIds.length + 1 : 1;

      const newTable = {
        users: [tempUser],
        portfolioStage,
        tableNumber,
        eventId,
      };
      console.log(`New Table ${JSON.stringify(newTable)}`);
      tableId = await this.dbService.add('tables', newTable);
    } else {
      table.users.push(tempUser);
      console.log(`Updating Table ${JSON.stringify(table)}`);
      delete table.id;
      await this.dbService.update('tables', tableId, table);
    }

    // Updating event
    const eventUpdate = { ...event };
    eventUpdate.loungersNum = event.loungersNum ? event.loungersNum + 1 : 1;

    if (!event.tableIds || !event.tableIds.includes(tableId)) {
      eventUpdate.tableIds = event.tableIds
        ? [...event.tableIds, tableId]
        : [tableId];
    }

    await this.eventService.update(eventId, eventUpdate);
    await this.dbService.update(`uuids/${eventId}`, user.id, tableId);
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
