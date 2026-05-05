const { runCardScraper } = require('./scraperUtils');

module.exports = async function scrapeMLH(page) {
  return runCardScraper(page, {
    platform: 'MLH',
    url: 'https://mlh.io/seasons/2026/events',
    cardSelector: '.event-wrapper, a[href*="utm_source=mlh"]',
    titleSelectors: ['.event-name', 'h3', 'h2'],
    linkSelector: '.event-link, a',
    waitSelectors: ['.event-wrapper', 'a[href*="utm_source=mlh"]'],
    defaultMode: 'offline',
  });
};
