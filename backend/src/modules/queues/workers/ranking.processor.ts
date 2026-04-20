import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { RankingService } from '../../ranking/ranking.service';
import { RANKING_QUEUE } from '../queue.constants';
import { RankingJobPayload } from '../dto/queue-jobs.dto';

@Processor(RANKING_QUEUE, { concurrency: 1 })
export class RankingProcessor extends WorkerHost {
  constructor(
    private readonly rankingService: RankingService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(RankingProcessor.name);
  }

  async process(job: Job<RankingJobPayload>): Promise<unknown> {
    this.logger.info({ jobId: job.id, data: job.data }, 'Running ranking job');
    return this.rankingService.recomputeRanking(job.data.reason);
  }
}
