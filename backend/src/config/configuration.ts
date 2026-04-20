import { parseRedisUrl } from '../modules/redis/redis.util';

export default () => {
  const redis = parseRedisUrl(
    process.env.REDIS_URL ?? 'redis://localhost:6379',
  );

  return {
    app: {
      nodeEnv: process.env.NODE_ENV ?? 'development',
      port: Number(process.env.PORT ?? 3000),
      logLevel: process.env.LOG_LEVEL ?? 'info',
      corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
      throttleTtl: Number(process.env.THROTTLE_TTL ?? 60),
      throttleLimit: Number(process.env.THROTTLE_LIMIT ?? 120),
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET ?? 'hackhunt-dev-secret',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
      adminSeedEmail: process.env.ADMIN_SEED_EMAIL ?? 'admin@hackhunt.app',
      adminSeedPassword: process.env.ADMIN_SEED_PASSWORD ?? 'change-me',
    },
    redis,
    scraping: {
      concurrency: Number(process.env.SCRAPE_CONCURRENCY ?? 4),
      retryCount: Number(process.env.SCRAPE_RETRY_COUNT ?? 3),
      requestTimeoutMs: Number(process.env.SCRAPE_REQUEST_TIMEOUT_MS ?? 20000),
    },
  };
};
