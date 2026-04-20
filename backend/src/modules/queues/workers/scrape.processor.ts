import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { QueueService } from '../queues.service';
import { ScrapingService } from '../../scraping/scraping.service';
import { SCRAPE_QUEUE } from '../queue.constants';
import { ScrapeJobPayload } from '../dto/queue-jobs.dto';

@Processor(SCRAPE_QUEUE, { concurrency: 2 })
export class ScrapeProcessor extends WorkerHost {
  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly queueService: QueueService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(ScrapeProcessor.name);
  }

  async process(job: Job<ScrapeJobPayload>): Promise<unknown> {
    this.logger.info({ jobId: job.id, data: job.data }, 'Running scrape job');
    const result = await this.scrapingService.executeScrapeCycle(job.data);
    await this.queueService.enqueueRanking('post-scrape');
    return result;
  }
}
