import { Injectable } from '@nestjs/common';
import { EventFormat, HackathonStatus, SourcePlatform } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const SOURCE_WEIGHT: Record<SourcePlatform, number> = {
  UNSTOP: 1.15,
  DEVFOLIO: 1.1,
  HACK2SKILL: 1.05,
  DEVPOST: 1.1,
  MLH: 1.2,
  HACKEREARTH: 1.05,
  EVENTBRITE: 0.95,
  COLLEGE_PORTAL: 0.9,
  INCUBATOR_PORTAL: 1.0,
  INTERNAL: 1.0,
};

@Injectable()
export class RankingService {
  constructor(private readonly prismaService: PrismaService) {}

  async recomputeRanking(
    reason: 'scheduled' | 'post-scrape' | 'manual',
  ): Promise<{ updated: number; reason: string }> {
    const now = new Date();
    const hackathons = await this.prismaService.hackathon.findMany({
      where: {
        status: { in: [HackathonStatus.OPEN, HackathonStatus.UPCOMING] },
      },
      select: {
        id: true,
        sourcePlatform: true,
        deadline: true,
        format: true,
        isBeginnerFriendly: true,
        isStudentFriendly: true,
        updatedAt: true,
      },
    });

    const updates = hackathons.map((item) => {
      const sourceScore = SOURCE_WEIGHT[item.sourcePlatform] ?? 1.0;
      const daysToDeadline = item.deadline
        ? Math.max(
            0,
            (item.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          )
        : 14;
      const urgencyBoost = 1 / Math.max(1, Math.sqrt(daysToDeadline + 1));
      const freshnessBoost =
        1 /
        Math.max(
          1,
          (now.getTime() - item.updatedAt.getTime()) / (1000 * 60 * 60 * 24),
        );
      const formatBoost =
        item.format === EventFormat.REMOTE
          ? 1.07
          : item.format === EventFormat.HYBRID
            ? 1.03
            : 1;
      const beginnerBoost = item.isBeginnerFriendly ? 1.08 : 1;
      const studentBoost = item.isStudentFriendly ? 1.06 : 1;

      const rankingScore =
        100 *
        sourceScore *
        formatBoost *
        beginnerBoost *
        studentBoost *
        (0.6 + urgencyBoost * 0.4);
      const trendingScore =
        rankingScore * (0.75 + Math.min(freshnessBoost, 1) * 0.25);

      return this.prismaService.hackathon.update({
        where: { id: item.id },
        data: {
          rankingScore,
          trendingScore,
        },
      });
    });

    if (updates.length > 0) {
      await this.prismaService.$transaction(updates);
    }

    return {
      updated: updates.length,
      reason,
    };
  }
}
