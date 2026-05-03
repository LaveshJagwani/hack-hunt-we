const cron = require('node-cron');
const { runAllScrapers } = require('../api/index');
const Hackathon = require('../models/Hackathon');

async function updateDatabase() {
  console.log(`[Scheduler] updateDatabase started at ${new Date().toISOString()}`);
  try {
    const data = await runAllScrapers();
    if (!data.length) {
      console.log('[Scheduler] Scrapers returned no hackathons. Database was not changed.');
      return { found: 0, upserted: 0, errors: 0 };
    }

    let successCount = 0;
    let errorCount = 0;

    for (const item of data) {
      try {
        await Hackathon.findOneAndUpdate(
          { link: item.link },
          item,
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        successCount++;
      } catch (dbErr) {
        errorCount++;
      }
    }
    console.log(`[Scheduler] Success: ${successCount} upserted. Errors: ${errorCount}`);
    return { found: data.length, upserted: successCount, errors: errorCount };
  } catch (error) {
    console.error(`[Scheduler] Error during updateDatabase:`, error);
    return { found: 0, upserted: 0, errors: 1 };
  }
}

async function seedDatabaseIfEmpty() {
  try {
    const existingCount = await Hackathon.estimatedDocumentCount();
    if (existingCount > 0) {
      console.log(`[Scheduler] Database already has ${existingCount} hackathons. Skipping startup seed.`);
      return;
    }

    console.log('[Scheduler] Database is empty. Starting one-time startup scrape.');
    updateDatabase();
  } catch (error) {
    console.error('[Scheduler] Failed to check whether database needs seeding:', error);
  }
}

function initScheduler() {
  // Modes based on prompt:
  // 1. Hourly → "0 * * * *"
  // 2. Daily → "0 0 * * *"
  // 3. Weekly → "0 0 * * 0"
  
  // Set default to Daily if not specified in .env
  const scheduleMode = process.env.CRON_SCHEDULE || '0 0 * * *'; 

  cron.schedule(scheduleMode, async () => {
    console.log(`[Cron] Triggered scheduled scraping job (${scheduleMode})`);
    await updateDatabase();
  });
  
  console.log(`[Scheduler] Initialized with cron schedule: "${scheduleMode}"`);
  seedDatabaseIfEmpty();
}

module.exports = { initScheduler, updateDatabase };
