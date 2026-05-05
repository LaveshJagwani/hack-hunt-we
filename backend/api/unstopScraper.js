const { runCardScraper } = require('./scraperUtils');

module.exports = async function scrapeUnstop(page) {
  return runCardScraper(page, {
    platform: 'Unstop',
    url: 'https://unstop.com/hackathons',
    cardSelector: 'a[href*="/hackathons/"]',
    titleSelectors: ['h2', 'h3', '[class*="title" i]'],
    linkSelector: null,
    waitSelectors: ['a[href*="/hackathons/"]'],
  });
};
