import { Inject, Injectable } from '@nestjs/common';
import {
  EventFormat,
  HackathonStatus,
  Prisma,
  ScrapeRunStatus,
  SourcePlatform,
  Tag,
} from '@prisma/client';
import slugify from 'slugify';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';
import { ScrapeJobPayload } from '../queues/dto/queue-jobs.dto';
import { NormalizedHackathon } from './interfaces/normalized-hackathon.interface';
import { ScraperProvider } from './interfaces/scraper-provider.interface';
import { SCRAPER_PROVIDERS_TOKEN } from './scraping.constants';
import { canonicalizeUrl, computeFingerprint } from './utils/scrape-helpers';

@Injectable()
export class ScrapingService {
  private readonly providerMap: Map<SourcePlatform, ScraperProvider>;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    @Inject(SCRAPER_PROVIDERS_TOKEN) providers: ScraperProvider[],
  ) {
    this.providerMap = new Map(
      providers.map((provider) => [provider.source, provider]),
    );
  }

  async executeScrapeCycle(payload: ScrapeJobPayload): Promise<{
    triggeredBy: string;
    sourcesProcessed: number;
    totalScraped: number;
    totalStored: number;
    runs: Array<{
      source: SourcePlatform;
      runId: string;
      scraped: number;
      stored: number;
      status: ScrapeRunStatus;
    }>;
  }> {
    const targetSources = payload.sources?.length
      ? payload.sources
      : [
          SourcePlatform.UNSTOP,
          SourcePlatform.DEVFOLIO,
          SourcePlatform.HACK2SKILL,
          SourcePlatform.DEVPOST,
          SourcePlatform.MLH,
        ];

    const runs: Array<{
      source: SourcePlatform;
      runId: string;
      scraped: number;
      stored: number;
      status: ScrapeRunStatus;
    }> = [];
    let totalScraped = 0;
    let totalStored = 0;

    for (const source of targetSources) {
      const result = await this.runProvider(source);
      runs.push(result);
      totalScraped += result.scraped;
      totalStored += result.stored;
    }

    await this.redisService.delByPrefix('hackathons:');

    return {
      triggeredBy: payload.triggeredBy,
      sourcesProcessed: runs.length,
      totalScraped,
      totalStored,
      runs,
    };
  }

  private async runProvider(source: SourcePlatform): Promise<{
    source: SourcePlatform;
    runId: string;
    scraped: number;
    stored: number;
    status: ScrapeRunStatus;
  }> {
    const run = await this.prismaService.scrapeRun.create({
      data: {
        sourcePlatform: source,
        status: ScrapeRunStatus.RUNNING,
      },
    });

    const startedAt = Date.now();

    try {
      const provider = this.providerMap.get(source);
      if (!provider) {
        throw new Error(`No provider configured for source ${source}`);
      }

      const normalizedItems = await provider.scrape();
      const stored = await this.persistNormalizedItems(source, normalizedItems);

      await this.prismaService.scrapeRun.update({
        where: { id: run.id },
        data: {
          status: ScrapeRunStatus.SUCCESS,
          completedAt: new Date(),
          durationMs: Date.now() - startedAt,
          itemsScraped: normalizedItems.length,
          itemsStored: stored,
        },
      });

      return {
        source,
        runId: run.id,
        scraped: normalizedItems.length,
        stored,
        status: ScrapeRunStatus.SUCCESS,
      };
    } catch (error) {
      await this.prismaService.scrapeRun.update({
        where: { id: run.id },
        data: {
          status: ScrapeRunStatus.FAILED,
          completedAt: new Date(),
          durationMs: Date.now() - startedAt,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });

      return {
        source,
        runId: run.id,
        scraped: 0,
        stored: 0,
        status: ScrapeRunStatus.FAILED,
      };
    }
  }

  private async persistNormalizedItems(
    source: SourcePlatform,
    items: NormalizedHackathon[],
  ): Promise<number> {
    let storedCount = 0;
    for (const item of items) {
      const isStored = await this.upsertHackathon(source, item);
      if (isStored) {
        storedCount += 1;
      }
    }
    return storedCount;
  }

  private async upsertHackathon(
    source: SourcePlatform,
    item: NormalizedHackathon,
  ): Promise<boolean> {
    const canonicalUrl = this.tryCanonicalize(
      item.canonicalUrl ?? item.sourceUrl,
    );
    const fingerprint = computeFingerprint({
      canonicalUrl,
      sourceUrl: item.sourceUrl,
      title: item.title,
      host: item.host,
      deadline: item.deadline,
    });
    const slug = this.generateSlug(item.title, fingerprint);
    const format = this.mapFormat(item.format);
    const status = this.mapStatus(item.deadline);
    const theme = this.resolveTheme(item);
    const cleanedTags = [
      ...new Set((item.tags ?? []).map((tag) => tag.trim()).filter(Boolean)),
    ];
    const now = new Date();

    await this.prismaService.$transaction(async (tx) => {
      const hackathon = await tx.hackathon.upsert({
        where: { dedupeFingerprint: fingerprint },
        create: {
          slug,
          title: item.title,
          summary: item.summary,
          description: item.description,
          host: item.host,
          sourcePlatform: source,
          sourceUrl: item.sourceUrl,
          canonicalUrl,
          dedupeFingerprint: fingerprint,
          theme,
          format,
          location: item.location,
          country: item.country,
          timezone: item.timezone,
          deadline: item.deadline,
          startDate: item.startDate,
          endDate: item.endDate,
          prizeLabel: item.prizeLabel,
          teamSizeMin: item.teamSizeMin,
          teamSizeMax: item.teamSizeMax,
          status,
          isStudentFriendly: item.isStudentFriendly ?? false,
          isBeginnerFriendly: item.isBeginnerFriendly ?? false,
          techStack: item.techStack ?? [],
          rawPayload: item.rawPayload as Prisma.InputJsonValue | undefined,
          lastScrapedAt: now,
        },
        update: {
          title: item.title,
          summary: item.summary,
          description: item.description,
          host: item.host,
          sourcePlatform: source,
          sourceUrl: item.sourceUrl,
          canonicalUrl,
          theme,
          format,
          location: item.location,
          country: item.country,
          timezone: item.timezone,
          deadline: item.deadline,
          startDate: item.startDate,
          endDate: item.endDate,
          prizeLabel: item.prizeLabel,
          teamSizeMin: item.teamSizeMin,
          teamSizeMax: item.teamSizeMax,
          status,
          isStudentFriendly: item.isStudentFriendly ?? false,
          isBeginnerFriendly: item.isBeginnerFriendly ?? false,
          techStack: item.techStack ?? [],
          rawPayload: item.rawPayload as Prisma.InputJsonValue | undefined,
          lastScrapedAt: now,
        },
      });

      await tx.sourceReference.upsert({
        where: {
          sourcePlatform_sourceUrl: {
            sourcePlatform: source,
            sourceUrl: item.sourceUrl,
          },
        },
        create: {
          sourcePlatform: source,
          sourceId: item.sourceId,
          sourceUrl: item.sourceUrl,
          canonicalUrl,
          isPrimary: true,
          hackathonId: hackathon.id,
          lastSeenAt: now,
        },
        update: {
          sourceId: item.sourceId,
          canonicalUrl,
          hackathonId: hackathon.id,
          lastSeenAt: now,
        },
      });

      if (cleanedTags.length === 0) {
        return;
      }

      const existingTags = await tx.tag.findMany({
        where: { name: { in: cleanedTags } },
      });
      const existingTagMap = new Map(
        existingTags.map((tag) => [tag.name, tag]),
      );
      const tagsToCreate = cleanedTags.filter(
        (tag) => !existingTagMap.has(tag),
      );

      if (tagsToCreate.length > 0) {
        await tx.tag.createMany({
          data: tagsToCreate.map((name) => ({ name })),
          skipDuplicates: true,
        });
      }

      const allTags: Tag[] = await tx.tag.findMany({
        where: { name: { in: cleanedTags } },
      });

      await tx.hackathonTag.deleteMany({
        where: { hackathonId: hackathon.id },
      });

      if (allTags.length > 0) {
        await tx.hackathonTag.createMany({
          data: allTags.map((tag) => ({
            hackathonId: hackathon.id,
            tagId: tag.id,
          })),
          skipDuplicates: true,
        });
      }
    });

    return true;
  }

  private generateSlug(title: string, fingerprint: string): string {
    const base =
      slugify(title, { lower: true, strict: true, trim: true }) || 'hackathon';
    return `${base}-${fingerprint.slice(0, 8)}`;
  }

  private tryCanonicalize(url: string): string {
    try {
      return canonicalizeUrl(url);
    } catch {
      return url;
    }
  }

  private mapFormat(format: NormalizedHackathon['format']): EventFormat {
    if (format === 'remote') return EventFormat.REMOTE;
    if (format === 'irl') return EventFormat.IRL;
    if (format === 'hybrid') return EventFormat.HYBRID;
    return EventFormat.UNKNOWN;
  }

  private mapStatus(deadline?: Date): HackathonStatus {
    if (!deadline) {
      return HackathonStatus.OPEN;
    }
    return deadline.getTime() < Date.now()
      ? HackathonStatus.CLOSED
      : HackathonStatus.OPEN;
  }

  private resolveTheme(item: NormalizedHackathon): string | undefined {
    if (item.theme) {
      return item.theme;
    }

    const joined = [
      ...(item.tags ?? []),
      ...(item.techStack ?? []),
      item.title,
      item.summary,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (joined.includes('ai') || joined.includes('ml')) return 'AI';
    if (joined.includes('web3') || joined.includes('blockchain')) return 'Web3';
    if (joined.includes('climate')) return 'Climate';
    if (joined.includes('fintech') || joined.includes('payments'))
      return 'FinTech';
    if (joined.includes('design') || joined.includes('figma')) return 'Design';
    if (joined.includes('health')) return 'Health';
    if (joined.includes('devtools') || joined.includes('api'))
      return 'DevTools';
    return undefined;
  }
}
