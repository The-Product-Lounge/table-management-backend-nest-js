import { DbModule } from './../db/db.module';
import { TableValidation } from './table-validation';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableConsumer } from './table-consumer';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'table',
    }),
    DbModule,
  ],
  controllers: [TableController],
  providers: [TableService, TableConsumer, TableValidation],
})
export class TableModule {}
