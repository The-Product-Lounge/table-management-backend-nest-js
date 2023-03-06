import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

@Schema()
class User {
  @Prop({ required: true })
  firstName: String;
  @Prop({ required: true })
  lastName: String;
  @Prop({ required: true })
  imgUrl: String;
  @Prop({ required: true })
  id: String;
}

@Schema({ collection: 'table' , versionKey: false })
export class Table {
  @Prop({ type: [Object], required: true })
  users: User[];

  @Prop({ required: true })
  portfolioStage: string;

  @Prop({ required: true })
  tableNumber: number;
}

export const TableSchema = SchemaFactory.createForClass(Table);
