import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Table, TableDocument } from 'src/schemas/table.schema';
import { TableDto } from './dto';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async getAll(): Promise<Table[]> {
    return this.tableModel.find().exec();
  }

  async getById(id: string): Promise<Table | null> {
    const ObjectId = mongoose.Types.ObjectId;
    const _id = new ObjectId(id);
    //returns an object or null
    return this.tableModel.findById(_id);
  }

  async update(dto: TableDto) {
    //returns number of docs modified
    return this.tableModel.updateOne({ _id: dto._id }, dto).exec();
  }

  async delete(id: string) {
    return this.tableModel.deleteOne({ _id: id });
  }

  async deleteAll() {
    return this.tableModel.deleteMany({});
  }

  async joinTable() {}
}
