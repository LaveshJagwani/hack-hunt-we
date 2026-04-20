import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { SCRAPER_PROVIDERS_TOKEN } from './scraping.constants';
import { ScraperProvider } from './interfaces/scraper-provider.interface';
import { DevfolioProvider } from './providers/devfolio.provider';
import { DevpostProvider } from './providers/devpost.provider';
import { Hack2SkillProvider } from './providers/hack2skill.provider';
import { MlhProvider } from './providers/mlh.provider';
import { UnstopProvider } from './providers/unstop.provider';

const scraperProviderClasses = [
  UnstopProvider,
  DevfolioProvider,
  Hack2SkillProvider,
  DevpostProvider,
  MlhProvider,
];

@Module({
  providers: [
    ...scraperProviderClasses,
    ScrapingService,
    {
      provide: SCRAPER_PROVIDERS_TOKEN,
      useFactory: (...providers: ScraperProvider[]) => providers,
      inject: scraperProviderClasses,
    },
  ],
  exports: [ScrapingService],
})
export class ScrapingModule {}
