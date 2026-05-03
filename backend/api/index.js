const scrapeDevpost = require('./devpostScraper');
const scrapeUnstop = require('./unstopScraper');
const scrapeDevfolio = require('./devfolioScraper');
const scrapeMLH = require('./mlhScraper');
const scrapeHackerEarth = require('./hackerearthScraper');
const scrapeHack2Skill = require('./hack2skillScraper');

async function runAllScrapers() {
  console.log('[Aggregator] Starting sequential Puppeteer scraping...');
  
  const scrapers = [
    scrapeDevpost,
    scrapeUnstop,
    scrapeDevfolio,
    scrapeMLH,
    scrapeHackerEarth,
    scrapeHack2Skill
  ];

  const results = [];
  
  // Limiting concurrency by resolving Promises in sequence or small batches.
  // Given Puppeteer can use RAM locally, we process sequentially.
  for (const scraper of scrapers) {
    try {
      const data = await scraper();
      if (Array.isArray(data)) {
        results.push(...data);
      }
    } catch (err) {
      console.error('[Aggregator] Scraper execution error:', err.message);
    }
  }

  // Remove duplicates based on 'link'
  const uniqueHackathons = [];
  const seenLinks = new Set();
  
  for (const hackathon of results) {
     if (!seenLinks.has(hackathon.link)) {
         seenLinks.add(hackathon.link);
         uniqueHackathons.push(hackathon);
     }
  }

  console.log(`[Aggregator] Scrapers finished. Unique hackathons found: ${uniqueHackathons.length}`);
  return uniqueHackathons;
}

module.exports = { runAllScrapers };