import { TableDto } from './dto/table.dto';
import { TableValidation } from './table-validation';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
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
  constructor(
    private tableService: TableService,
    private tableValidation: TableValidation,
  ) {}

  @Get()
  getAll() {
    return this.tableService.getAll();
  }

  @Put(':id')
  update(@Body() dto: TableDto) {
    return dto;
    // const isValidated = this.tableValidation.hasExpectedProperties(dto);
    // if(!isValidated) throw new BadRequestException('Bad Request', { cause: new Error(), description: 'Table format is incorrect' })
    // return this.tableService.update(dto);
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
