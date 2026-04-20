import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { AlertFrequency } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ALERTS_QUEUE } from '../queue.constants';
import { AlertsJobPayload } from '../dto/queue-jobs.dto';

@Processor(ALERTS_QUEUE, { concurrency: 2 })
export class AlertsProcessor extends WorkerHost {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(AlertsProcessor.name);
  }

  async process(job: Job<AlertsJobPayload>): Promise<unknown> {
    this.logger.info({ jobId: job.id, data: job.data }, 'Running alerts job');

    const nextSevenDays = new Date();
    nextSevenDays.setDate(nextSevenDays.getDate() + 7);

    const [subscriptions, expiringHackathons] = await Promise.all([
      this.prismaService.alertSubscription.findMany({
        where: {
          isActive: true,
          frequency: { in: [AlertFrequency.DAILY, AlertFrequency.REALTIME] },
        },
        select: {
          id: true,
          userExternalId: true,
          email: true,
          criteria: true,
          hackathonId: true,
        },
      }),
      this.prismaService.hackathon.findMany({
        where: {
          deadline: { gte: new Date(), lte: nextSevenDays },
        },
        select: { id: true, title: true, slug: true, deadline: true },
        orderBy: { deadline: 'asc' },
      }),
    ]);

    return {
      subscriptionsCount: subscriptions.length,
      expiringHackathonsCount: expiringHackathons.length,
    };
  }
}
