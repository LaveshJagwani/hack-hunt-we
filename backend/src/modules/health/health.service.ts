import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getHealth(): Promise<{
    status: 'ok' | 'degraded';
    timestamp: string;
    checks: { database: 'ok' | 'failed'; redis: 'ok' | 'failed' };
  }> {
    let databaseStatus: 'ok' | 'failed' = 'ok';
    let redisStatus: 'ok' | 'failed' = 'ok';

    try {
      await this.prismaService.$queryRaw`SELECT 1`;
    } catch {
      databaseStatus = 'failed';
    }

    try {
      await this.redisService.ping();
    } catch {
      redisStatus = 'failed';
    }

    const healthy = databaseStatus === 'ok' && redisStatus === 'ok';

    return {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseStatus,
        redis: redisStatus,
      },
    };
  }
}
