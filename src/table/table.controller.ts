import { UserDto, TableDto } from './dto';
import { TableService } from './table.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
} from '@nestjs/common';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Get()
  getAll() {
    return this.tableService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.tableService.getById(id);
  }

  @Put(':id')
  update(@Body() dto: TableDto) {
    return this.tableService.update(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tableService.delete(id);
  }

  @Delete()
  deleteAll() {
    return this.tableService.deleteAll();
  }

  @Post('join-table')
  joinTable(@Body() dto: UserDto) {
    return this.tableService.joinTable(dto);
  }
}
