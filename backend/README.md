# HackHunt Backend

Production-grade NestJS backend for HackHunt, a multi-source hackathon discovery platform.

## Stack

- NestJS + TypeScript (strict)
- PostgreSQL + Prisma ORM
- Redis + BullMQ (jobs + workers)
- Playwright + Cheerio + Axios (scraping)
- JWT auth (admin endpoints)
- Pino structured logging
- Swagger OpenAPI docs

## API Base

`/api/v1`

### Core Endpoints

- `GET /api/v1/hackathons`
- `GET /api/v1/hackathons/:slug`
- `GET /api/v1/hackathons/trending`
- `GET /api/v1/hackathons/search?q=`
- `GET /api/v1/hackathons/filter`
- `GET /api/v1/health`
- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/scrape/run` (JWT required)

## Scraping Providers

- Unstop
- Devfolio
- Hack2Skill
- Devpost
- MLH

Each provider follows a shared contract and supports retries, anti-block request behavior, static parsing, and JS-rendered scraping where needed.

## Queues

- `scrapeQueue`
- `rankingQueue`
- `cleanupQueue`
- `alertsQueue`

## Quick Start

1. Copy env:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate:dev`
5. Start API:
   - `npm run start:dev`
6. Start worker (separate process):
   - `npm run start:worker`

Swagger docs: `http://localhost:3000/api/docs`

## Docker

From repository root:

```bash
docker compose up --build
```

Services:

- Postgres: `localhost:5432`
- Redis: `localhost:6379`
- API: `localhost:3000`
- Worker: background queue processor

## Notes

- Ranking scores are recomputed via queue jobs and cron schedules.
- Hackathon list/detail/filter responses are Redis-cached.
- Admin account can bootstrap from `ADMIN_SEED_EMAIL` + `ADMIN_SEED_PASSWORD` on first login.
