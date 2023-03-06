import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: 'table_management_db',
    }),
    TableModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
