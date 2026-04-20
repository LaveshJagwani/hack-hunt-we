import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { HackathonStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CLEANUP_QUEUE } from '../queue.constants';
import { CleanupJobPayload } from '../dto/queue-jobs.dto';

@Processor(CLEANUP_QUEUE, { concurrency: 1 })
export class CleanupProcessor extends WorkerHost {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(CleanupProcessor.name);
  }

  async process(job: Job<CleanupJobPayload>): Promise<unknown> {
    this.logger.info({ jobId: job.id, data: job.data }, 'Running cleanup job');

    const oldScrapeRunsCutoff = new Date();
    oldScrapeRunsCutoff.setDate(oldScrapeRunsCutoff.getDate() - 30);

    const archiveCutoff = new Date();
    archiveCutoff.setDate(archiveCutoff.getDate() - 180);

    const [deletedRuns, archivedHackathons] =
      await this.prismaService.$transaction([
        this.prismaService.scrapeRun.deleteMany({
          where: { startedAt: { lt: oldScrapeRunsCutoff } },
        }),
        this.prismaService.hackathon.updateMany({
          where: {
            status: { in: [HackathonStatus.CLOSED] },
            updatedAt: { lt: archiveCutoff },
          },
          data: { status: HackathonStatus.ARCHIVED },
        }),
      ]);

    return {
      deletedRuns: deletedRuns.count,
      archivedHackathons: archivedHackathons.count,
    };
  }
}
