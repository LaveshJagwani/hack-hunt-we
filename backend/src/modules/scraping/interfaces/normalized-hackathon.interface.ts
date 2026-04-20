import { SourcePlatform } from '@prisma/client';

export interface NormalizedHackathon {
  sourcePlatform: SourcePlatform;
  sourceId?: string;
  sourceUrl: string;
  canonicalUrl?: string;
  title: string;
  summary?: string;
  description?: string;
  host?: string;
  theme?: string;
  format?: 'remote' | 'irl' | 'hybrid' | 'unknown';
  location?: string;
  country?: string;
  timezone?: string;
  deadline?: Date;
  startDate?: Date;
  endDate?: Date;
  prizeLabel?: string;
  teamSizeMin?: number;
  teamSizeMax?: number;
  tags?: string[];
  techStack?: string[];
  isStudentFriendly?: boolean;
  isBeginnerFriendly?: boolean;
  rawPayload?: unknown;
}
