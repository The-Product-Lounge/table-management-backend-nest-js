import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

@Schema()
class User {
  @Prop()
  firstName: String;
  @Prop()
  lastName: String;
  @Prop()
  imgUrl: String;
  @Prop()
  id: String;
}

@Schema({ collection: 'table' })
export class Table {
  @Prop([User])
  users: User[];

  @Prop()
  portfolioStage: string;

  @Prop()
  tableNumber: number;
}



export const TableSchema = SchemaFactory.createForClass(Table);
