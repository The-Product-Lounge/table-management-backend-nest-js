import { TableValidation } from './table-validation';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
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
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Queue } from 'bull';

@Controller('table')
export class TableController {
  constructor(
    private tableService: TableService,
    private tableValidation: TableValidation,
    @InjectQueue('table') private readonly tableQueue: Queue,
  ) {}

  @Get()
  getAll() {
    return this.tableService.getAll();
  }

  // TODO: create a table DTO
  @Put(':id')
  update(@Body() dto: any) {
    const isValidated = this.tableValidation.hasExpectedProperties(dto);
    if(!isValidated) throw new BadRequestException('Bad Request', { cause: new Error(), description: 'Table format is incorrect' })
    return this.tableService.update(dto);
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
    await this.tableQueue.add('join-table', dto);
    return 'adding to table';
    // return this.tableService.joinTable(dto)
  }
}
