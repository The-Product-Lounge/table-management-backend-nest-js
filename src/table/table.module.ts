import { Table, TableSchema } from './schema/table.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
