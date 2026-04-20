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
export class MlhProvider extends BaseScraperProvider {
  readonly source = SourcePlatform.MLH;
  private readonly baseUrl = 'https://mlh.io';
  private readonly listUrl = 'https://mlh.io/seasons/2026/events';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async scrape(): Promise<NormalizedHackathon[]> {
    const html = await this.fetchStaticHtml(this.listUrl);
    const $ = this.cheerio(html);
    const items: NormalizedHackathon[] = [];

    $('a[href*="/events/"], a[href*="/seasons/"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href || !/event/i.test(href)) {
        return;
      }

      const sourceUrl = new URL(href, this.baseUrl).toString();
      const card = $(element).closest('article, li, div');
      const title =
        sanitizeText(
          card.find('h3, h2, [class*="name"], [class*="title"]').first().text(),
        ) ?? sanitizeText($(element).text());
      if (!title) {
        return;
      }

      const textBlock = sanitizeText(card.text()) ?? '';
      const dateMatch = textBlock.match(/([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/i);

      items.push({
        sourcePlatform: this.source,
        sourceUrl,
        canonicalUrl: canonicalizeUrl(sourceUrl),
        title,
        host: 'Major League Hacking',
        summary:
          sanitizeText(card.find('p').first().text()) ??
          textBlock.slice(0, 220),
        format: /in-person/i.test(textBlock)
          ? 'irl'
          : /hybrid/i.test(textBlock)
            ? 'hybrid'
            : 'remote',
        location: sanitizeText(card.find('[class*="location"]').first().text()),
        deadline: parsePossibleDate(dateMatch?.[1]),
        tags: ['student-friendly', 'mentor-heavy'],
        techStack: inferTech(textBlock),
        isStudentFriendly: true,
        isBeginnerFriendly: true,
        rawPayload: { sourceText: textBlock },
      });
    });

    return dedupeByUrl(items).slice(0, 100);
  }
}

function inferTech(text: string): string[] {
  const tech: string[] = [];
  if (/ai|machine learning/i.test(text)) tech.push('AI');
  if (/hardware|iot/i.test(text)) tech.push('IoT');
  if (/web|frontend|react/i.test(text)) tech.push('Frontend');
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
