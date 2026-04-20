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
export class DevfolioProvider extends BaseScraperProvider {
  readonly source = SourcePlatform.DEVFOLIO;
  private readonly baseUrl = 'https://devfolio.co';
  private readonly listUrl = 'https://devfolio.co/hackathons';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async scrape(): Promise<NormalizedHackathon[]> {
    const html = await this.fetchRenderedHtml(
      this.listUrl,
      'a[href*="/hackathons/"]',
    );
    const $ = this.cheerio(html);
    const items: NormalizedHackathon[] = [];

    $('a[href*="/hackathons/"]').each((_, element) => {
      const href = $(element).attr('href');
      const sourceUrl = href
        ? new URL(href, this.baseUrl).toString()
        : undefined;
      if (!sourceUrl) {
        return;
      }

      const wrapper = $(element).closest('article, li, div');
      const title =
        sanitizeText(wrapper.find('h3, h2, [class*="title"]').first().text()) ??
        sanitizeText($(element).text());
      if (!title) {
        return;
      }

      const textBlock = sanitizeText(wrapper.text()) ?? '';
      const deadlineMatch = textBlock.match(
        /(deadline|apply by|closes?)[:\s-]+([A-Za-z0-9,\s]+)/i,
      );
      const startMatch = textBlock.match(
        /(starts?|kickoff)[:\s-]+([A-Za-z0-9,\s]+)/i,
      );

      items.push({
        sourcePlatform: this.source,
        sourceUrl,
        canonicalUrl: canonicalizeUrl(sourceUrl),
        title,
        host:
          sanitizeText(
            wrapper
              .find('[class*="organizer"], [class*="host"]')
              .first()
              .text(),
          ) ?? 'Devfolio',
        summary:
          sanitizeText(wrapper.find('p').first().text()) ??
          textBlock.slice(0, 240),
        format: /hybrid/i.test(textBlock)
          ? 'hybrid'
          : /online|remote/i.test(textBlock)
            ? 'remote'
            : 'unknown',
        location: sanitizeText(
          wrapper.find('[class*="location"]').first().text(),
        ),
        deadline: parsePossibleDate(deadlineMatch?.[2]),
        startDate: parsePossibleDate(startMatch?.[2]),
        tags: inferTags(textBlock),
        techStack: inferTech(textBlock),
        isStudentFriendly: /student/i.test(textBlock),
        isBeginnerFriendly: /beginner|newbie/i.test(textBlock),
        rawPayload: { sourceText: textBlock },
      });
    });

    return dedupeByUrl(items).slice(0, 120);
  }
}

function inferTags(text: string): string[] {
  const tags = ['trending'];
  if (/mentor/i.test(text)) tags.push('mentor-heavy');
  if (/student/i.test(text)) tags.push('student-friendly');
  if (/easy|beginner/i.test(text)) tags.push('easy win');
  return tags;
}

function inferTech(text: string): string[] {
  const tech: string[] = [];
  if (/ai|llm|ml/i.test(text)) tech.push('AI');
  if (/web3|blockchain/i.test(text)) tech.push('Web3');
  if (/frontend|react|ui/i.test(text)) tech.push('Frontend');
  if (/api|backend|node/i.test(text)) tech.push('APIs');
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
