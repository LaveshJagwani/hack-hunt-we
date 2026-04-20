import { Hackathon, Tag } from '@prisma/client';

export interface HackathonApiModel {
  id: string;
  slug: string;
  title: string;
  host: string | null;
  summary: string | null;
  description: string | null;
  theme: string | null;
  format: 'remote' | 'irl' | 'hybrid' | 'unknown';
  location: string | null;
  deadline: string | null;
  deadlineLabel: string;
  prize: string | null;
  tags: string[];
  tech: string[];
  source: string;
  sourceUrl: string;
  rankingScore: number;
  trendingScore: number;
  isStudentFriendly: boolean;
  isBeginnerFriendly: boolean;
}

const FORMAT_MAP: Record<string, HackathonApiModel['format']> = {
  REMOTE: 'remote',
  IRL: 'irl',
  HYBRID: 'hybrid',
  UNKNOWN: 'unknown',
};

export function mapHackathonToApi(
  hackathon: Hackathon & { tags: { tag: Tag }[] },
): HackathonApiModel {
  return {
    id: hackathon.id,
    slug: hackathon.slug,
    title: hackathon.title,
    host: hackathon.host,
    summary: hackathon.summary,
    description: hackathon.description,
    theme: hackathon.theme,
    format: FORMAT_MAP[hackathon.format] ?? 'unknown',
    location: hackathon.location,
    deadline: hackathon.deadline?.toISOString() ?? null,
    deadlineLabel: formatDeadlineLabel(hackathon.deadline),
    prize: hackathon.prizeLabel ?? null,
    tags: hackathon.tags.map((entry) => entry.tag.name),
    tech: hackathon.techStack,
    source: hackathon.sourcePlatform,
    sourceUrl: hackathon.sourceUrl,
    rankingScore: hackathon.rankingScore,
    trendingScore: hackathon.trendingScore,
    isStudentFriendly: hackathon.isStudentFriendly,
    isBeginnerFriendly: hackathon.isBeginnerFriendly,
  };
}

function formatDeadlineLabel(deadline: Date | null): string {
  if (!deadline) {
    return 'Deadline TBD';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return formatter.format(deadline);
}
