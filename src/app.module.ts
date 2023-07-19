import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { CommonModule } from './common/common.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [TableModule, CommonModule, EventModule],
})
export class AppModule {}
