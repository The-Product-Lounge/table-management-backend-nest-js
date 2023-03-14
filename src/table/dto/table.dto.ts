import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { UserDto } from './user.dto';

export class TableDto {
  [key: string]: Table;
}

export class Table {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: { id: string } & UserDto[];

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Refinement',
    'Design & Composition',
    'Planning & Research',
    'Brainstorming',
  ])
  portfolioStage: string;

  @IsNumber()
  @IsNotEmpty()
  tableNumber: number;
}
