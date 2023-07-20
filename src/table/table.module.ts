import { DbModule } from '../common/db/db.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableConsumer } from './table-consumer';
import { EventService } from 'src/event/event.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'table',
    }),
    DbModule,
  ],
  controllers: [TableController],
  providers: [TableService, TableConsumer, EventService],
})
export class TableModule {}
