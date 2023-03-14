import { UserDto } from './dto';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TableService } from './table.service';

@Processor('table')
export class TableConsumer {
  constructor(private readonly tableService: TableService) {}

  @Process({ name: 'join-table', concurrency: 1 })
  async joinTable(job: Job<{ id: string } & UserDto>) {
    await this.tableService.joinTable(job.data);
  }
}
