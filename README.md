# HackHunt

HackHunt is a minimal, MERN stack web application that aggregates hackathons from various platforms (Devpost, Unstop, Devfolio, MLH, HackerEarth, and Hack2Skill).

**This project has been completely refactored to use NATIVE CUSTOM SCRAPERS (no Apify, no paid APIs).**

## Local Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on port 27017

### Backend Setup
1. `cd backend`
2. `npm install` (Installs native Scraper tools: Puppeteer, Axios, Cheerio)
3. Ensure `.env` is configured natively (e.g. `MONGO_URI`). You no longer need an Apify token!
4. Start the server (which binds the Cron scheduler automatically):
   ```bash
   node server.js
   ```

### Refreshing Data Manually
Data is refreshed by standard scheduled intervals driven natively by `node-cron`.
If you want to manually trigger the scraping parallel aggregator, visit:
- **`GET http://localhost:5000/api/refresh`**

### Frontend Setup
1. Open a new terminal.
2. `cd frontend`
3. `npm install`
4. Start the Vite React server:
   ```bash
   npm run dev
   ```

## Native Scrapers Details
- `/backend/api/index.js` uses `Promise.allSettled` to spawn all headless/Axios processes simultaneously.
- `/backend/services/scheduler.js` controls interval triggers natively inserting into MongoDB mappings.
