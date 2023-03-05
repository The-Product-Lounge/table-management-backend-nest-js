import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';

@Module({
  imports: [TableModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
