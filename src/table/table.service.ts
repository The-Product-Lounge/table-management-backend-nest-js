import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Table, TableDocument } from './schema/table.schema';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async getTables(): Promise<Table[]> {
    return this.tableModel.find().exec();
  }

  async getTableById() {}

  async joinTable() {}

  async updateTable() {}

  async deleteTables() {}

  async deleteTable() {}
}
