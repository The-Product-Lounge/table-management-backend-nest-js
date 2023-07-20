import { DbModule } from '../common/db/db.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableConsumer } from './table-consumer';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'table',
    }),
    DbModule,
    EventModule,
  ],
  controllers: [TableController],
  providers: [TableService, TableConsumer],
})
export class TableModule {}
