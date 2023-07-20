import { TableWithIdDto } from './dto/table.dto';
import { UserDto } from './dto';
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
  getAll(): Promise<TableWithIdDto[]> {
    return this.tableService.getAll();
  }

  @Put(':id')
  update(@Body() dto: TableWithIdDto) {
    return this.tableService.update(dto);
  }

  @Put('/remove/:id')
  removeUser(@Body() dto: TableWithIdDto) {
    return this.tableService.removeUserFromTable(dto);
  }

  @Delete('/delete-tables')
  deleteAll() {
    return this.tableService.deleteAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tableService.delete(id);
  }

  @Post('join-table')
  async joinTable(@Body() dto: UserDto) {
    return this.tableService.createJoinTableRequest(dto);
  }
}
