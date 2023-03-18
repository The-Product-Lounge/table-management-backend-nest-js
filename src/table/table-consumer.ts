import { UserWithIdDto } from './dto/user.dto';
import { UserDto } from './dto';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TableService } from './table.service';

@Processor('table')
export class TableConsumer {
  constructor(private readonly tableService: TableService) {}

  @Process({ name: 'join-table', concurrency: 1 })
  async joinTable(job: Job<UserWithIdDto>) {
    try {
      await this.tableService.joinTable(job.data);
      job.moveToCompleted('done');
    } catch (err) {
      job.moveToFailed({ message: 'error' });
      job.log(`Job failed with error: ${err.message}`);
      throw err;
    }
  }
}
