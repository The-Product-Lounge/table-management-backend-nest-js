import { UserDto, TableDto } from './dto';
import { TableService } from './table.service';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Get()
  getTables() {
    return 'Hi'
  }

  @Get('/:id')
  getTableById() {
    return 'get by id'
  }

  @Post('/join-table')
  joinTable(@Body() dto: UserDto) {
    return dto
  }

  @Put('/:id')
  updateTable(@Body() dto: TableDto) {
    return dto
  }

  @Delete('/delete-tables')
  deleteTables() {
    return 'delete tables'
  }

  @Delete('/:id')
  deleteTable() {
    return 'delete table'
  }
}
