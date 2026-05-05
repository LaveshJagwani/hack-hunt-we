const { runCardScraper } = require('./scraperUtils');

module.exports = async function scrapeDevpost(page) {
  return runCardScraper(page, {
    platform: 'Devpost',
    url: 'https://devpost.com/hackathons',
    cardSelector: '.hackathon-tile, .search-result',
    titleSelectors: ['h3', 'h2'],
    linkSelector: 'a',
    waitSelectors: ['.hackathon-tile', '.search-result'],
  });
};
