import { TableWithIdDto } from './dto/table.dto';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { DbService } from './../db/db.service';
import { UserDto, UserWithIdDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bull';

@Injectable()
export class TableService {
  constructor(
    private dbService: DbService,
    @InjectQueue('table') private readonly tableQueue: Queue,
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
    const { portfolioStage } = user;
    delete user.portfolioStage;

    const tables = await this.getAll();

    const table = tables.find(
      (arrayTable) =>
        arrayTable.portfolioStage === portfolioStage &&
        arrayTable.users.length < 3,
    );
    let tableId = table ? table.id : null;

    if (!table) {
      let tableNumber = 1;

      for (let index = 0; index < tables.length; index++) {
        const table = tables[index];
        if (table.tableNumber === tableNumber) tableNumber++;
        else break;
      }

      const newTable = {
        users: [user],
        portfolioStage,
        tableNumber,
      };
      tableId = await this.dbService.add('tables', newTable);
    } else {
      table.users.push(user);
      delete table.id;
      await this.dbService.update('tables', tableId, table);
    }
    await this.dbService.update('uuids', user.id, tableId);
    return tableId;
  }

  async createJoinTableRequest(user: UserDto) {
    const requestId = uuidv4();
    this.tableQueue.add('join-table', { ...user, id: requestId });
    return requestId;
  }
}
