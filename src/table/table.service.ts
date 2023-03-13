import { DbService } from './../db/db.service';
import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { TableDto } from './dto';

@Injectable()
export class TableService {
  constructor(private dbService: DbService) {}

  async getAll(): Promise<TableDto> {
    try {
      const tables = await this.dbService.query('tables', 'tableNumber');
      return tables;
    } catch (err) {
      throw err;
    }
  }

  async update(table: TableDto): Promise<void> {
    const tableId = Object.keys(table)[0];
    try {
      await this.dbService.update('tables', tableId, table[tableId]);
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

  async joinTable(user: UserDto): Promise<string> {
    const { portfolioStage } = user;
    delete user.portfolioStage;

    const tables = await this.getAll();

    let tableKey = tables
      ? Object.keys(tables).find((key) => {
          const table = tables[key];
          return (
            table.users.length < 4 && table.portfolioStage === portfolioStage
          );
        })
      : null;

    let table = tableKey ? tables[tableKey] : null;

    if (!table) {
      let tableNumber = 1;

      for (let tableId in tables) {
        const table = tables[tableId];
        if (table.tableNumber === tableNumber) tableNumber++;
        else break;
      }

      const newTable = {
        users: [user],
        portfolioStage,
        tableNumber,
      };

      tableKey = await this.dbService.add('tables', newTable);
    } else {
      table.users.push(user);
      await this.dbService.update('tables', tableKey, table);
    }
    await this.dbService.update('uuids', user.id, tableKey);
    return tableKey;
  }
}
