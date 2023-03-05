import { Injectable } from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table, TableDocument } from 'src/schemas/table.schema';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
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
