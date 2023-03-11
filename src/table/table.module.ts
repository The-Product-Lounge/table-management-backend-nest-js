import { DbService } from './../db/db.service';
import { FirebaseService } from '../firebase/firebase.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableConsumer } from './table-consumer';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'table',
    })
  ],
  controllers: [TableController],
  providers: [TableService, TableConsumer, FirebaseService, DbService],
})
export class TableModule {}
