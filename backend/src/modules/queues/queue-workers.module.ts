import { Module } from '@nestjs/common';
import { RankingModule } from '../ranking/ranking.module';
import { ScrapingModule } from '../scraping/scraping.module';
import { QueuesModule } from './queues.module';
import { AlertsProcessor } from './workers/alerts.processor';
import { CleanupProcessor } from './workers/cleanup.processor';
import { RankingProcessor } from './workers/ranking.processor';
import { ScrapeProcessor } from './workers/scrape.processor';

@Module({
  imports: [QueuesModule, ScrapingModule, RankingModule],
  providers: [
    ScrapeProcessor,
    RankingProcessor,
    CleanupProcessor,
    AlertsProcessor,
  ],
})
export class QueueWorkersModule {}
