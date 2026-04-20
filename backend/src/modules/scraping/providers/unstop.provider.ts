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
export class UnstopProvider extends BaseScraperProvider {
  readonly source = SourcePlatform.UNSTOP;
  private readonly baseUrl = 'https://unstop.com';
  private readonly listUrl = 'https://unstop.com/hackathons';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async scrape(): Promise<NormalizedHackathon[]> {
    const html = await this.fetchRenderedHtml(this.listUrl);
    const $ = this.cheerio(html);
    const items: NormalizedHackathon[] = [];

    $('a[href*="/hackathons/"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) {
        return;
      }

      const sourceUrl = new URL(href, this.baseUrl).toString();
      const title =
        sanitizeText(
          $(element).find('h2, h3, [class*="title"]').first().text(),
        ) ?? sanitizeText($(element).text());

      if (!title) {
        return;
      }

      const containerText =
        sanitizeText($(element).closest('article, li, div').text()) ?? '';
      const deadlineMatch = containerText.match(
        /(deadline|closes?)[:\s-]+([A-Za-z0-9,\s]+)/i,
      );
      const deadline = parsePossibleDate(deadlineMatch?.[2]);

      items.push({
        sourcePlatform: this.source,
        sourceUrl,
        canonicalUrl: canonicalizeUrl(sourceUrl),
        title,
        host: 'Unstop',
        summary:
          sanitizeText($(element).find('p').first().text()) ??
          containerText.slice(0, 240),
        format: /hybrid/i.test(containerText)
          ? 'hybrid'
          : /remote|online/i.test(containerText)
            ? 'remote'
            : 'unknown',
        location: /india/i.test(containerText) ? 'India' : undefined,
        deadline,
        tags: ['student-friendly'],
        isStudentFriendly: true,
        rawPayload: { sourceText: containerText },
      });
    });

    return dedupeByUrl(items).slice(0, 100);
  }
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
