import { IsString, IsNotEmpty, IsNumber, IsArray } from "class-validator";
import { UserDto } from "./user.dto";

export class TableDto {
    @IsString()
    @IsNotEmpty()
    _id: string;

    @IsArray()
    @IsNotEmpty()
    users: UserDto[];

    @IsString()
    @IsNotEmpty()
    portfolioStage: string;

    @IsNumber()
    @IsNotEmpty()
    tableNumber: number;
}