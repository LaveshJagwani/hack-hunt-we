const { launchBrowser } = require('./browserConfig');

module.exports = async function scrapeHackerEarth() {
  console.log('[Scraper] Starting HackerEarth...');
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");
    await page.goto('https://www.hackerearth.com/challenges/hackathon/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    await new Promise(r => setTimeout(r, 3000));
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate(() => {
      const hackathons = [];
      const cards = document.querySelectorAll('.challenge-card-modern, .challenge-list');
      cards.forEach(card => {
        const titleEl = card.querySelector('.challenge-name') || card.querySelector('.challenge-list-title');
        const linkEl = card.querySelector('a');
        if (titleEl && linkEl) {
           const title = titleEl.innerText.trim();
           let link = linkEl.href;
           if (!link.startsWith('http')) link = `https://www.hackerearth.com${link}`;
           hackathons.push({ title, platform: 'HackerEarth', link, deadline: 'Check Website', mode: 'online', tags: [] });
        }
      });
      return hackathons;
    });

    console.log(`[Scraper] HackerEarth finished: found ${results.length}`);
    return results;
  } catch (error) {
    console.error('[Scraper Error] HackerEarth failed:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
