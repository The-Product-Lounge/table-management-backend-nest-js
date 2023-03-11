import { UserDto } from './dto';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TableService } from './table.service';

@Processor('table')
export class TableConsumer {
  constructor(
    private readonly tableService: TableService,
  ) {}

  @Process('join-table')
  async joinTable(job: Job<UserDto>) {
    await this.tableService.joinTable(job.data);
  }
}
