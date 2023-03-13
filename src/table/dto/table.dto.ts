import { IsString, IsNotEmpty, IsNumber, IsArray, IsObject } from 'class-validator';
import { UserDto } from './user.dto';

export class TableDto {
  [key: string]: Table;
}

export class Table {
  @IsArray()
  @IsNotEmpty()
  users: { id: string } & UserDto[];

  @IsString()
  @IsNotEmpty()
  portfolioStage: string;

  @IsNumber()
  @IsNotEmpty()
  tableNumber: number;
}
