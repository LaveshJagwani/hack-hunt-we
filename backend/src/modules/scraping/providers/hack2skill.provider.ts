import { Injectable } from '@nestjs/common';
import { SourcePlatform } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { BaseScraperProvider } from './base-scraper.provider';
import { NormalizedHackathon } from '../interfaces/normalized-hackathon.interface';
import {
  canonicalizeUrl,
  parsePossibleDate,
  sanitizeText,
} from '../utils/scrape-helpers';

@Injectable()
export class Hack2SkillProvider extends BaseScraperProvider {
  readonly source = SourcePlatform.HACK2SKILL;
  private readonly baseUrl = 'https://hack2skill.com';
  private readonly listUrl = 'https://hack2skill.com/hackathons';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async scrape(): Promise<NormalizedHackathon[]> {
    const html = await this.fetchStaticHtml(this.listUrl);
    const $ = this.cheerio(html);
    const items: NormalizedHackathon[] = [];

    $('a[href*="hackathon"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) {
        return;
      }

      const sourceUrl = new URL(href, this.baseUrl).toString();
      const card = $(element).closest('article, li, div');
      const title =
        sanitizeText(card.find('h3, h2, [class*="title"]').first().text()) ??
        sanitizeText($(element).text());
      if (!title) {
        return;
      }

      const context = sanitizeText(card.text()) ?? '';
      const deadlineMatch = context.match(
        /(deadline|closes?)[:\s-]+([A-Za-z0-9,\s]+)/i,
      );

      items.push({
        sourcePlatform: this.source,
        sourceUrl,
        canonicalUrl: canonicalizeUrl(sourceUrl),
        title,
        host:
          sanitizeText(
            card.find('[class*="host"], [class*="organizer"]').first().text(),
          ) ?? 'Hack2Skill',
        summary:
          sanitizeText(card.find('p').first().text()) ?? context.slice(0, 220),
        format: /hybrid/i.test(context)
          ? 'hybrid'
          : /online|remote/i.test(context)
            ? 'remote'
            : 'unknown',
        location: sanitizeText(card.find('[class*="location"]').first().text()),
        deadline: parsePossibleDate(deadlineMatch?.[2]),
        tags: inferTags(context),
        techStack: inferTech(context),
        isStudentFriendly: /student|campus/i.test(context),
        isBeginnerFriendly: /beginner|starter/i.test(context),
        rawPayload: { sourceText: context },
      });
    });

    return dedupeByUrl(items).slice(0, 100);
  }
}

function inferTags(text: string): string[] {
  const tags: string[] = [];
  if (/mentor/i.test(text)) tags.push('mentor-heavy');
  if (/hybrid/i.test(text)) tags.push('hybrid');
  if (/easy|beginner|starter/i.test(text)) tags.push('easy win');
  return tags;
}

function inferTech(text: string): string[] {
  const tech: string[] = [];
  if (/ai|ml|llm/i.test(text)) tech.push('AI');
  if (/cloud|aws|gcp/i.test(text)) tech.push('Cloud');
  if (/data|analytics/i.test(text)) tech.push('Data');
  return tech;
}

function dedupeByUrl(items: NormalizedHackathon[]): NormalizedHackathon[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.sourceUrl)) {
      return false;
    }
    seen.add(item.sourceUrl);
    return true;
  });
}
