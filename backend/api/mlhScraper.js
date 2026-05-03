const puppeteer = require('puppeteer');

module.exports = async function scrapeMLH() {
  console.log('[Scraper] Starting MLH...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] 
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/118.0.0.0 Safari/537.36");
    await page.goto('https://mlh.io/seasons/2024/events', { waitUntil: 'networkidle2', timeout: 60000 });
    
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate(() => {
      const hackathons = [];
      const wrappers = document.querySelectorAll('.event-wrapper');
      wrappers.forEach(el => {
        const titleEl = el.querySelector('.event-name');
        const linkEl = el.querySelector('.event-link');
        const dateEl = el.querySelector('.event-date');
        const locEl = el.querySelector('.event-location');
        
        if (titleEl && linkEl) {
          const title = titleEl.innerText.trim();
          const link = linkEl.href;
          const deadline = dateEl ? dateEl.innerText.trim() : 'TBD';
          const locationText = locEl ? locEl.innerText.toLowerCase() : '';
          const mode = locationText.includes('digital') || locationText.includes('online') ? 'online' : 'offline';
          hackathons.push({ title, platform: 'MLH', link, deadline, mode, tags: [] });
        }
      });
      return hackathons;
    });

    console.log(`[Scraper] MLH finished: found ${results.length}`);
    return results;
  } catch (error) {
    console.error('[Scraper Error] MLH failed:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
