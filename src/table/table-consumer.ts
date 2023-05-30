import { UserWithIdDto } from './dto/user.dto';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TableService } from './table.service';

@Processor('table')
export class TableConsumer {
  constructor(private readonly tableService: TableService) {}

  @Process({ name: 'join-table', concurrency: 1 })
  async joinTable(job: Job<UserWithIdDto>) {
    try {
      console.log(`Handling Join Table Request - ${JSON.stringify(job)}`);
      await this.tableService.joinTable(job.data);
    } catch (e) {
      console.error(
        `Error While Joining Table - ${JSON.stringify(
          e.message,
        )}, job:${JSON.stringify(job)}`,
      );
      await job.moveToFailed(e.messag);
    }
  }

  @OnQueueCompleted()
  async queueCompleted(job: Job<UserWithIdDto>) {
    try {
      await job.remove();
      console.log(
        `Completed Handling Join Table Request - ${JSON.stringify(job.data)}`,
      );
    } catch (e) {
      console.error(
        `Error While Joining Table - ${JSON.stringify(
          e.message,
        )}, job:${JSON.stringify(job)}`,
      );
      await job.moveToFailed(e.messag);
    }
  }
}
