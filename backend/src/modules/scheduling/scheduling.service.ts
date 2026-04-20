import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueueService } from '../queues/queues.service';

@Injectable()
export class SchedulingService {
  constructor(private readonly queueService: QueueService) {}

  @Cron('0 */3 * * *')
  async runRecurringScrape(): Promise<void> {
    await this.queueService.enqueueScrape('scheduler');
  }

  @Cron('15 * * * *')
  async runRecurringRanking(): Promise<void> {
    await this.queueService.enqueueRanking('scheduled');
  }

  @Cron('30 2 * * *')
  async runRecurringCleanup(): Promise<void> {
    await this.queueService.enqueueCleanup('scheduled');
  }

  @Cron('0 8 * * *')
  async runRecurringAlerts(): Promise<void> {
    await this.queueService.enqueueAlerts('scheduled');
  }
}
