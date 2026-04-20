import { SourcePlatform } from '@prisma/client';

export interface ScrapeJobPayload {
  triggeredBy: 'scheduler' | 'admin';
  sources?: SourcePlatform[];
}

export interface RankingJobPayload {
  reason: 'scheduled' | 'post-scrape' | 'manual';
}

export interface CleanupJobPayload {
  reason: 'scheduled' | 'manual';
}

export interface AlertsJobPayload {
  reason: 'scheduled' | 'manual';
}
