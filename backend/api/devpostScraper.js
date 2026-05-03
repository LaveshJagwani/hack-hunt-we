const { launchBrowser } = require('./browserConfig');

module.exports = async function scrapeDevpost() {
  console.log('[Scraper] Starting Devpost...');
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");
    await page.goto('https://devpost.com/hackathons', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Stealth delay + lazy load scroll
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate(() => {
      const hackathons = [];
      const cards = document.querySelectorAll('.hackathon-tile, .search-result');
      cards.forEach(card => {
        const titleEl = card.querySelector('h3') || card.querySelector('h2');
        const linkEl = card.querySelector('a');
        if (titleEl && linkEl) {
           const title = titleEl.innerText.trim();
           const link = linkEl.href;
           const mode = card.innerText.toLowerCase().includes('online') ? 'online' : 'offline';
           hackathons.push({ title, platform: 'Devpost', link, deadline: 'Check Website', mode, tags: [] });
        }
      });
      return hackathons;
    });

    console.log(`[Scraper] Devpost finished: found ${results.length}`);
    return results;
  } catch (error) {
    console.error('[Scraper Error] Devpost failed:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
