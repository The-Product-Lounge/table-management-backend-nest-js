import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Refinement',
    'Design & Composition',
    'Planning & Research',
    'Brainstorming',
    'Product Manager',
  ])
  @IsOptional()
  portfolioStage: string;

  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}

export class UserWithIdDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
