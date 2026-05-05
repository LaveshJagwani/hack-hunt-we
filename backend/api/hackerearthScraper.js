const { runCardScraper } = require('./scraperUtils');

module.exports = async function scrapeHackerEarth(page) {
  return runCardScraper(page, {
    platform: 'HackerEarth',
    url: 'https://www.hackerearth.com/challenges/hackathon/',
    baseUrl: 'https://www.hackerearth.com',
    cardSelector: '.challenge-card-modern, .challenge-list',
    titleSelectors: ['.challenge-name', '.challenge-list-title', 'h2', 'h3'],
    linkSelector: 'a',
    waitSelectors: ['.challenge-card-modern', '.challenge-list', 'a[href*="/challenges/"]'],
  });
};
