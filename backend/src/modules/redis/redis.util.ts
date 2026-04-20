export interface RedisConnectionConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export function parseRedisUrl(redisUrl: string): RedisConnectionConfig {
  const parsed = new URL(redisUrl);
  const db = parsed.pathname
    ? Number(parsed.pathname.replace('/', '')) || 0
    : 0;

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    password: parsed.password || undefined,
    db,
  };
}
