import { SourcePlatform } from '@prisma/client';
import { NormalizedHackathon } from './normalized-hackathon.interface';

export interface ScraperProvider {
  readonly source: SourcePlatform;
  scrape(): Promise<NormalizedHackathon[]>;
}
