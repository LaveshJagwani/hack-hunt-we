const { launchBrowser } = require('./browserConfig');
const scrapeDevpost = require('./devpostScraper');
const scrapeUnstop = require('./unstopScraper');
const scrapeDevfolio = require('./devfolioScraper');
const scrapeMLH = require('./mlhScraper');
const scrapeHackerEarth = require('./hackerearthScraper');
const scrapeHack2Skill = require('./hack2skillScraper');
const { delay, normalizeHackathon, setupPage } = require('./scraperUtils');

const scrapers = [
  { name: 'Devpost', run: scrapeDevpost },
  { name: 'Unstop', run: scrapeUnstop },
  { name: 'Devfolio', run: scrapeDevfolio },
  { name: 'MLH', run: scrapeMLH },
  { name: 'HackerEarth', run: scrapeHackerEarth },
  { name: 'Hack2Skill', run: scrapeHack2Skill },
];

async function runAllScrapers() {
  console.log('[Aggregator] Starting controlled Puppeteer scraping...');
  const browser = await launchBrowser();
  const results = [];

  try {
    for (const scraper of scrapers) {
      let page;
      console.log(`[Aggregator] ${scraper.name}: starting`);

      try {
        page = await browser.newPage();
        await setupPage(page, scraper.name);
        const data = await scraper.run(page);
        const normalized = Array.isArray(data)
          ? data.map(normalizeHackathon).filter(Boolean)
          : [];

        results.push(...normalized);
        console.log(`[Aggregator] ${scraper.name}: finished with ${normalized.length} items`);
      } catch (error) {
        console.error(`[Aggregator] ${scraper.name}: failed - ${error.message}`);
      } finally {
        if (page && !page.isClosed()) {
          await page.close().catch((error) => {
            console.warn(`[Aggregator] ${scraper.name}: page close failed - ${error.message}`);
          });
        }
      }

      await delay(1500);
    }
  } finally {
    await browser.close().catch((error) => {
      console.warn(`[Aggregator] Browser close failed - ${error.message}`);
    });
  }

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
