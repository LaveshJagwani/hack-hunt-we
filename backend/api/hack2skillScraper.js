const { launchBrowser } = require('./browserConfig');

module.exports = async function scrapeHack2Skill() {
  console.log('[Scraper] Starting Hack2Skill...');
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");
    await page.goto('https://hack2skill.com/hackathons', { waitUntil: 'networkidle2', timeout: 60000 });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate(() => {
      const hackathons = [];
      const cards = document.querySelectorAll('a[href*="hackathon"]');
      cards.forEach(card => {
        const titleEl = card.querySelector('h2, h3, .title');
        if (titleEl && titleEl.innerText.trim() !== '') {
           const title = titleEl.innerText.trim();
           const link = card.href;
           hackathons.push({ title, platform: 'Hack2Skill', link, deadline: 'Check Website', mode: 'online', tags: [] });
        }
      });
      return hackathons;
    });

    console.log(`[Scraper] Hack2Skill finished: found ${results.length}`);
    return results;
  } catch (error) {
    console.error('[Scraper Error] Hack2Skill failed:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
