import { createHash } from 'crypto';

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function sanitizeText(
  value: string | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = normalizeWhitespace(value);
  return normalized.length ? normalized : undefined;
}

export function canonicalizeUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hash = '';
  parsed.searchParams.sort();
  return parsed.toString().replace(/\/$/, '');
}

export function parsePossibleDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return undefined;
  }

  return new Date(timestamp);
}

export function computeFingerprint(input: {
  canonicalUrl?: string;
  sourceUrl: string;
  title: string;
  host?: string;
  deadline?: Date;
}): string {
  const hash = createHash('sha256');
  hash.update(input.canonicalUrl ?? input.sourceUrl);
  hash.update('|');
  hash.update(input.title.toLowerCase().trim());
  hash.update('|');
  hash.update((input.host ?? '').toLowerCase().trim());
  hash.update('|');
  hash.update(input.deadline?.toISOString() ?? '');
  return hash.digest('hex');
}
