import { Injectable, NotFoundException } from '@nestjs/common';
import { EventFormat, HackathonStatus, Prisma } from '@prisma/client';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ListHackathonsQueryDto } from './dto/list-hackathons-query.dto';
import { HackathonApiModel, mapHackathonToApi } from './hackathons.mapper';

const CACHE_TTL_SECONDS = 60;

@Injectable()
export class HackathonsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async listHackathons(
    query: ListHackathonsQueryDto,
  ): Promise<PaginatedResponse<HackathonApiModel>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const cacheKey = `hackathons:list:${JSON.stringify({ ...query, page, limit })}`;
    const cached =
      await this.redisService.getJson<PaginatedResponse<HackathonApiModel>>(
        cacheKey,
      );
    if (cached) {
      return cached;
    }

    const where = this.buildWhere(
      query,
      this.parseFormatForQuery(query.format),
    );
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.hackathon.findMany({
        where,
        include: { tags: { include: { tag: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: this.buildOrderBy(query.sort),
      }),
      this.prismaService.hackathon.count({ where }),
    ]);

    const payload: PaginatedResponse<HackathonApiModel> = {
      data: items.map(mapHackathonToApi),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };

    await this.redisService.setJson(cacheKey, payload, CACHE_TTL_SECONDS);
    return payload;
  }

  async searchHackathons(
    query: string,
    options: Omit<ListHackathonsQueryDto, 'q'>,
  ): Promise<PaginatedResponse<HackathonApiModel>> {
    return this.listHackathons({ ...options, q: query });
  }

  async getHackathonBySlug(slug: string): Promise<{ data: HackathonApiModel }> {
    const cacheKey = `hackathons:slug:${slug}`;
    const cached = await this.redisService.getJson<{ data: HackathonApiModel }>(
      cacheKey,
    );
    if (cached) {
      return cached;
    }

    const item = await this.prismaService.hackathon.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    });

    if (!item) {
      throw new NotFoundException('Hackathon not found');
    }

    const payload = { data: mapHackathonToApi(item) };
    await this.redisService.setJson(cacheKey, payload, CACHE_TTL_SECONDS);
    return payload;
  }

  async getTrending(limit = 12): Promise<{ data: HackathonApiModel[] }> {
    const cacheKey = `hackathons:trending:${limit}`;
    const cached = await this.redisService.getJson<{
      data: HackathonApiModel[];
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    const items = await this.prismaService.hackathon.findMany({
      where: {
        status: { in: [HackathonStatus.OPEN, HackathonStatus.UPCOMING] },
      },
      include: { tags: { include: { tag: true } } },
      take: limit,
      orderBy: [{ trendingScore: 'desc' }, { deadline: 'asc' }],
    });

    const payload = {
      data: items.map(mapHackathonToApi),
    };
    await this.redisService.setJson(cacheKey, payload, CACHE_TTL_SECONDS);
    return payload;
  }

  async getFilters(): Promise<{
    data: {
      themes: string[];
      formats: string[];
      vibes: string[];
    };
  }> {
    const cacheKey = 'hackathons:filters';
    const cached = await this.redisService.getJson<{
      data: { themes: string[]; formats: string[]; vibes: string[] };
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    const [themesRaw, tagsRaw] = await Promise.all([
      this.prismaService.hackathon.findMany({
        where: { theme: { not: null } },
        distinct: ['theme'],
        select: { theme: true },
        orderBy: { theme: 'asc' },
      }),
      this.prismaService.tag.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    const payload = {
      data: {
        themes: themesRaw
          .map((entry) => entry.theme)
          .filter((entry): entry is string => Boolean(entry)),
        formats: ['remote', 'irl', 'hybrid'],
        vibes: tagsRaw.map((entry) => entry.name),
      },
    };
    await this.redisService.setJson(cacheKey, payload, CACHE_TTL_SECONDS);
    return payload;
  }

  private buildWhere(
    query: ListHackathonsQueryDto,
    format: EventFormat | undefined,
  ): Prisma.HackathonWhereInput {
    const normalizedQ = query.q?.trim();
    const normalizedVibe = query.vibe?.trim();

    return {
      status: { in: [HackathonStatus.OPEN, HackathonStatus.UPCOMING] },
      ...(query.theme ? { theme: query.theme } : {}),
      ...(format
        ? {
            format,
          }
        : {}),
      ...(query.source ? { sourcePlatform: query.source } : {}),
      ...(normalizedVibe
        ? {
            tags: {
              some: {
                tag: {
                  name: {
                    equals: normalizedVibe,
                    mode: 'insensitive',
                  },
                },
              },
            },
          }
        : {}),
      ...(normalizedQ
        ? {
            OR: [
              { title: { contains: normalizedQ, mode: 'insensitive' } },
              { host: { contains: normalizedQ, mode: 'insensitive' } },
              { summary: { contains: normalizedQ, mode: 'insensitive' } },
              { description: { contains: normalizedQ, mode: 'insensitive' } },
              { location: { contains: normalizedQ, mode: 'insensitive' } },
              { theme: { contains: normalizedQ, mode: 'insensitive' } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: normalizedQ, mode: 'insensitive' },
                    },
                  },
                },
              },
              { techStack: { has: normalizedQ } },
            ],
          }
        : {}),
    };
  }

  private buildOrderBy(
    sort: ListHackathonsQueryDto['sort'],
  ): Prisma.HackathonOrderByWithRelationInput[] {
    switch (sort) {
      case 'deadline':
        return [{ deadline: 'asc' }, { rankingScore: 'desc' }];
      case 'recent':
        return [{ updatedAt: 'desc' }];
      case 'ranking':
        return [{ rankingScore: 'desc' }, { deadline: 'asc' }];
      case 'trending':
      default:
        return [{ trendingScore: 'desc' }, { deadline: 'asc' }];
    }
  }

  async invalidateCache(): Promise<void> {
    await this.redisService.delByPrefix('hackathons:');
  }

  parseFormatForQuery(
    value: 'remote' | 'irl' | 'hybrid' | undefined,
  ): EventFormat | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = value.toLowerCase();
    if (normalized === 'remote') return EventFormat.REMOTE;
    if (normalized === 'irl') return EventFormat.IRL;
    if (normalized === 'hybrid') return EventFormat.HYBRID;
    return undefined;
  }
}
