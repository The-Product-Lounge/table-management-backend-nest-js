import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { FirebaseService } from './firebase/firebase.service';
import { DbService } from './db/db.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: 'table_management_db',
    }),
    TableModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [FirebaseService, DbService],
})
export class AppModule {}
