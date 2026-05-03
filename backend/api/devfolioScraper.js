const puppeteer = require('puppeteer');

module.exports = async function scrapeDevfolio() {
  console.log('[Scraper] Starting Devfolio...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] 
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36");
    await page.goto('https://devfolio.co/hackathons', { waitUntil: 'networkidle2', timeout: 60000 });
    
    await new Promise(r => setTimeout(r, 3000));
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate(() => {
      const hackathons = [];
      const cards = document.querySelectorAll('a[href^="https://"]');
      cards.forEach(card => {
        const titleEl = card.querySelector('h3') || card.querySelector('h2');
        if (titleEl) {
           const title = titleEl.innerText.trim();
           const link = card.href;
           const mode = card.innerText.toLowerCase().includes('offline') ? 'offline' : 'online';
           hackathons.push({ title, platform: 'Devfolio', link, deadline: 'Check Website', mode, tags: [] });
        }
      });
      return hackathons;
    });

    console.log(`[Scraper] Devfolio finished: found ${results.length}`);
    return results;
  } catch (error) {
    console.error('[Scraper Error] Devfolio failed:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
