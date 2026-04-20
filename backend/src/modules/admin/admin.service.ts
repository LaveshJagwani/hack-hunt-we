import { Injectable } from '@nestjs/common';
import { QueueService } from '../queues/queues.service';
import { RunScrapeDto } from './dto/run-scrape.dto';

@Injectable()
export class AdminService {
  constructor(private readonly queueService: QueueService) {}

  async triggerScrape(
    dto: RunScrapeDto,
  ): Promise<{ accepted: true; jobId: string }> {
    const job = await this.queueService.enqueueScrape('admin', dto.sources);
    await this.queueService.enqueueRanking('manual');

    return {
      accepted: true,
      jobId: String(job.id),
    };
  }
}
