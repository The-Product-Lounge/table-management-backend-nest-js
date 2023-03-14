import { IsString, IsNotEmpty, IsIn } from 'class-validator';

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
  ])
  portfolioStage?: string;

  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}
