const { runCardScraper } = require('./scraperUtils');

module.exports = async function scrapeDevfolio(page) {
  return runCardScraper(page, {
    platform: 'Devfolio',
    url: 'https://devfolio.co/hackathons',
    cardSelector: 'a[href*="/hackathons/"], a[href*="devfolio.co"]',
    titleSelectors: ['h3', 'h2'],
    linkSelector: null,
    waitSelectors: ['a[href*="/hackathons/"]', 'h2', 'h3'],
  });
};
