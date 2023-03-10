import { FirebaseService } from '../firebase/firebase.service';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { Table, TableSchema } from 'src/schemas/table.schema';
import { TableConsumer } from './table-consumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
    BullModule.registerQueueAsync({
      name: 'table',
    })
  ],
  controllers: [TableController],
  providers: [TableService, TableConsumer, FirebaseService],
})
export class TableModule {}
