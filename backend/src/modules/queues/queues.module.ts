import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queues.service';
import {
  ALERTS_QUEUE,
  CLEANUP_QUEUE,
  RANKING_QUEUE,
  SCRAPE_QUEUE,
} from './queue.constants';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: SCRAPE_QUEUE },
      { name: RANKING_QUEUE },
      { name: CLEANUP_QUEUE },
      { name: ALERTS_QUEUE },
    ),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueuesModule {}
