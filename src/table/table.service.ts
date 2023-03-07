import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Table, TableDocument } from 'src/schemas/table.schema';
import { TableDto } from './dto';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { Queue } from 'bull';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async getAll(): Promise<Table[]> {
    return this.tableModel.find().sort({ tableNumber: 1 });
  }

  async getById(id: string): Promise<Table | null> {
    const ObjectId = mongoose.Types.ObjectId;
    const _id = new ObjectId(id);
    //returns an object or null
    return this.tableModel.findById(_id);
  }

  async update(table: TableDto) {
    //returns number of docs modified
    return this.tableModel.updateOne({ _id: table._id }, table).exec();
  }

  async delete(id: string) {
    //returns number deleted
    return this.tableModel.deleteOne({ _id: id });
  }

  async deleteAll() {
    //returns delete count
    return this.tableModel.deleteMany({});
  }

  async joinTable(user: UserDto) {
      const { portfolioStage } = user;
      delete user.portfolioStage;
      const table = await this.tableModel.findOne({
        portfolioStage,
        'users.3': { $exists: false },
      });
      if (!table) {
        const tables = await this.tableModel.find().sort({ tableNumber: 1 });

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

        return this.tableModel.create(newTable);
      } else {
        table.users.push(user);
        let tableId = table._id;

        await this.tableModel.updateOne({ _id: tableId }, table).exec();
        return table;
      }
  }
}
