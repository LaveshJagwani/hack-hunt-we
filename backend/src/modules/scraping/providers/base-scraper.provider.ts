import axios, { AxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium } from 'playwright';
import { load } from 'cheerio';
import { normalizeWhitespace } from '../utils/scrape-helpers';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.119 Safari/537.36',
];

@Injectable()
export abstract class BaseScraperProvider {
  constructor(protected readonly configService: ConfigService) {}

  protected get timeoutMs(): number {
    return this.configService.get<number>('scraping.requestTimeoutMs', 20000);
  }

  protected get retryCount(): number {
    return this.configService.get<number>('scraping.retryCount', 3);
  }

  protected async withRetries<T>(
    label: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < this.retryCount) {
          await this.randomDelay(300 * attempt, 900 * attempt);
        }
      }
    }

    throw new Error(
      `${label} failed after ${this.retryCount} attempts: ${String(lastError)}`,
    );
  }

  protected async fetchStaticHtml(
    url: string,
    extraConfig: AxiosRequestConfig = {},
  ): Promise<string> {
    return this.withRetries('fetchStaticHtml', async () => {
      const response = await axios.get<string>(url, {
        timeout: this.timeoutMs,
        headers: {
          'User-Agent': this.pickUserAgent(),
          'Accept-Language': 'en-US,en;q=0.9',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...extraConfig.headers,
        },
        ...extraConfig,
      });

      await this.randomDelay(250, 700);
      return response.data;
    });
  }

  protected async fetchRenderedHtml(
    url: string,
    waitForSelector?: string,
  ): Promise<string> {
    return this.withRetries('fetchRenderedHtml', async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: this.pickUserAgent(),
        locale: 'en-US',
      });
      const page = await context.newPage();

      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: this.timeoutMs,
        });
        if (waitForSelector) {
          await page.waitForSelector(waitForSelector, {
            timeout: this.timeoutMs,
          });
        } else {
          await page.waitForLoadState('networkidle', {
            timeout: this.timeoutMs,
          });
        }
        await this.randomDelay(350, 950);
        return await page.content();
      } finally {
        await context.close();
        await browser.close();
      }
    });
  }

  protected cheerio(html: string) {
    return load(html);
  }

  protected text(value: string | null | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = normalizeWhitespace(value);
    return normalized.length ? normalized : undefined;
  }

  private pickUserAgent(): string {
    return (
      USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)] ??
      USER_AGENTS[0]
    );
  }

  protected async randomDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.floor(minMs + Math.random() * (maxMs - minMs + 1));
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
