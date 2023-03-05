import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.vo7bnoy.mongodb.net/?retryWrites=true&w=majority',
    ),
    TableModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
