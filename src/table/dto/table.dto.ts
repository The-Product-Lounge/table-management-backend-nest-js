import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsIn,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { UserWithIdDto } from './user.dto';

export class TableDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserWithIdDto)
  @ArrayMaxSize(3)
  users: UserWithIdDto[];

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

export class TableWithIdDto extends TableDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
