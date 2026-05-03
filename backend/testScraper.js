const { runAllScrapers } = require('./api/index.js');

(async () => {
  console.log('Testing scrapers natively...');
  try {
    const data = await runAllScrapers();
    console.log(`\nTotal hackathons scraped successfully: ${data.length}`);
    if (data.length > 0) {
      console.log('\n--- Sample Data (First 3) ---');
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
    } else {
      console.log('\nNo data returned. Scrapers might be failing or getting blocked.');
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
  process.exit(0);
})();
