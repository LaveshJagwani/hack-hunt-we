import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SourcePlatform } from '@prisma/client';
import {
  ALERTS_JOB,
  ALERTS_QUEUE,
  CLEANUP_JOB,
  CLEANUP_QUEUE,
  RANKING_JOB,
  RANKING_QUEUE,
  SCRAPE_JOB,
  SCRAPE_QUEUE,
} from './queue.constants';
import {
  AlertsJobPayload,
  CleanupJobPayload,
  RankingJobPayload,
  ScrapeJobPayload,
} from './dto/queue-jobs.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(SCRAPE_QUEUE)
    private readonly scrapeQueue: Queue<ScrapeJobPayload>,
    @InjectQueue(RANKING_QUEUE)
    private readonly rankingQueue: Queue<RankingJobPayload>,
    @InjectQueue(CLEANUP_QUEUE)
    private readonly cleanupQueue: Queue<CleanupJobPayload>,
    @InjectQueue(ALERTS_QUEUE)
    private readonly alertsQueue: Queue<AlertsJobPayload>,
  ) {}

  enqueueScrape(
    triggeredBy: 'scheduler' | 'admin',
    sources?: SourcePlatform[],
  ): Promise<Job<ScrapeJobPayload>> {
    return this.scrapeQueue.add(
      SCRAPE_JOB,
      { triggeredBy, sources },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1500 },
        priority: triggeredBy === 'admin' ? 1 : 3,
      },
    );
  }

  enqueueRanking(
    reason: RankingJobPayload['reason'],
  ): Promise<Job<RankingJobPayload>> {
    return this.rankingQueue.add(
      RANKING_JOB,
      { reason },
      {
        attempts: 2,
        backoff: { type: 'fixed', delay: 1000 },
      },
    );
  }

  enqueueCleanup(
    reason: CleanupJobPayload['reason'],
  ): Promise<Job<CleanupJobPayload>> {
    return this.cleanupQueue.add(CLEANUP_JOB, { reason }, { attempts: 1 });
  }

  enqueueAlerts(
    reason: AlertsJobPayload['reason'],
  ): Promise<Job<AlertsJobPayload>> {
    return this.alertsQueue.add(ALERTS_JOB, { reason }, { attempts: 2 });
  }
}
