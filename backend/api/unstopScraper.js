const { launchBrowser } = require('./browserConfig');

module.exports = async function scrapeUnstop() {
  console.log('[Scraper] Starting Unstop...');
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");
    await page.goto('https://unstop.com/hackathons', { waitUntil: 'networkidle2', timeout: 60000 });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate(() => {
      const hackathons = [];
      const cards = document.querySelectorAll('a[href*="/hackathons/"]');
      cards.forEach(card => {
        const titleEl = card.querySelector('h2') || card.querySelector('h3');
        if (titleEl && titleEl.innerText.trim() !== '') {
           const title = titleEl.innerText.trim();
           const link = card.href;
           hackathons.push({ title, platform: 'Unstop', link, deadline: 'Check Website', mode: 'online', tags: [] });
        }
      });
      return hackathons;
    });

    console.log(`[Scraper] Unstop finished: found ${results.length}`);
    return results;
  } catch (error) {
    console.error('[Scraper Error] Unstop failed:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
