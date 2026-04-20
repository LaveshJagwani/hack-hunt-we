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
export class DevpostProvider extends BaseScraperProvider {
  readonly source = SourcePlatform.DEVPOST;
  private readonly baseUrl = 'https://devpost.com';
  private readonly listUrl = 'https://devpost.com/hackathons';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async scrape(): Promise<NormalizedHackathon[]> {
    const html = await this.fetchRenderedHtml(
      this.listUrl,
      'a[href*="/software/"], a[href*="/hackathons/"]',
    );
    const $ = this.cheerio(html);
    const items: NormalizedHackathon[] = [];

    $('a[href*="/hackathons/"], a[href*="/software/"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href || !/hackathon|challenge/i.test(href)) {
        return;
      }

      const sourceUrl = new URL(href, this.baseUrl).toString();
      const container = $(element).closest('article, li, div');
      const title =
        sanitizeText(
          container.find('h3, h2, [class*="title"]').first().text(),
        ) ?? sanitizeText($(element).text());
      if (!title) {
        return;
      }

      const context = sanitizeText(container.text()) ?? '';
      const deadlineMatch = context.match(
        /(deadline|ends?|closes?)[:\s-]+([A-Za-z0-9,\s]+)/i,
      );

      items.push({
        sourcePlatform: this.source,
        sourceUrl,
        canonicalUrl: canonicalizeUrl(sourceUrl),
        title,
        host:
          sanitizeText(
            container
              .find('[class*="organization"], [class*="host"]')
              .first()
              .text(),
          ) ?? 'Devpost',
        summary:
          sanitizeText(container.find('p').first().text()) ??
          context.slice(0, 240),
        format: /in-person|onsite/i.test(context)
          ? 'irl'
          : /hybrid/i.test(context)
            ? 'hybrid'
            : 'remote',
        location: sanitizeText(
          container.find('[class*="location"]').first().text(),
        ),
        deadline: parsePossibleDate(deadlineMatch?.[2]),
        tags: inferTags(context),
        techStack: inferTech(context),
        isStudentFriendly: /student|university|college/i.test(context),
        isBeginnerFriendly: /beginner/i.test(context),
        rawPayload: { sourceText: context },
      });
    });

    return dedupeByUrl(items).slice(0, 120);
  }
}

function inferTags(text: string): string[] {
  const tags: string[] = [];
  if (/mentor/i.test(text)) tags.push('mentor-heavy');
  if (/frontend|design/i.test(text)) tags.push('frontend');
  if (/popular|featured|trending/i.test(text)) tags.push('crowd favorite');
  return tags;
}

function inferTech(text: string): string[] {
  const tech: string[] = [];
  if (/ai|machine learning/i.test(text)) tech.push('AI');
  if (/api|backend/i.test(text)) tech.push('Backend');
  if (/mobile|android|ios/i.test(text)) tech.push('Mobile');
  if (/blockchain|web3/i.test(text)) tech.push('Web3');
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
