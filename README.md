# HackHunt

HackHunt is a minimal, MERN stack web application that aggregates hackathons from various platforms (like Devfolio, Unstop, Hack2Skill). It uses a scraper service (powered by Apify/Puppeteer concept) and a scheduled cron job to keep data up to date.

## Local Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on port 27017

### Backend Setup
1. `cd backend`
2. `npm install`
3. Make sure `.env` is properly configured (e.g. `MONGO_URI`).
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Open a new terminal.
2. `cd frontend`
3. `npm install`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Note on Scraper
A fully functional `apify-client` implementation is provided in `backend/services/scraperService.js`. If you don't provide a real `APIFY_API_TOKEN` in the `.env` file, it seamlessly falls back to injecting realistic mock data so that the app natively functions out-of-the-box and can be demoed easily.

## Note on HackerEarth API
The prompt suggested enriching data using the HackerEarth API optionally. The standard HackerEarth API v4 is primarily centered around code evaluation and execution rather than a directory query API for ongoing external hackathons. Due to this constraint, it is not incredibly useful for our MVP scraping requirements, and therefore was cleanly skipped.
