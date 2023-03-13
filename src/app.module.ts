import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TableModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDDIS_LABS_HOST,
        port: +process.env.REDDIS_LABS_PORT,
        password: process.env.REDDIS_LABS_PASSWORD,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
