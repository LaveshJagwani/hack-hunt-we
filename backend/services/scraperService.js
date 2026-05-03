const { ApifyClient } = require('apify-client');
const Hackathon = require('../models/Hackathon');

// If you have a specific Apify actor for hackathons, you can use its ID.
// For example, scraping Devfolio or Unstop via Google Search or existing actors.
// We'll simulate the generic run here. 
// A real Apify actor ID should be replaced below, e.g., 'apify/google-search-scraper'
const ACTOR_ID = 'apify/hackathon-scraper'; 

const runScraper = async () => {
  try {
    console.log('Starting scraper...');
    
    // Check if token exists
    const token = process.env.APIFY_API_TOKEN;
    if (!token || token === 'your_apify_api_token') {
      console.log('No valid Apify token found. Using fallback mock data for demonstration...');
      await saveMockData();
      return;
    }

    const client = new ApifyClient({ token });
    // This is an example call to an Apify actor that scrapes hackathons
    const run = await client.actor(ACTOR_ID).call({
      // Input parameters for the actor
      platforms: ['devfolio', 'unstop', 'hack2skill']
    });

    console.log(`Apify Actor Run successful: ${run.id}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    await processItems(items);
    console.log('Scraping and DB update complete.');
  } catch (error) {
    console.error('Error running scraper:', error);
  }
};

const processItems = async (items) => {
  for (const item of items) {
    const hackathon = {
      title: item.title || 'Unknown Hackathon',
      platform: item.platform || 'Unknown',
      link: item.url || item.link,
      deadline: item.deadline ? new Date(item.deadline) : null,
      mode: item.mode || 'online',
      tags: item.tags || []
    };

    if (!hackathon.link) continue;

    try {
      await Hackathon.findOneAndUpdate(
        { link: hackathon.link },
        hackathon,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbError) {
      console.error('Error saving hackathon:', dbError);
    }
  }
};

// Fallback method to populate MVP data
const saveMockData = async () => {
  const mockData = [
    {
      title: 'Global AI Hackathon 2026',
      platform: 'Devfolio',
      link: 'https://devfolio.co/hackathons/global-ai',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      mode: 'online',
      tags: ['AI', 'Machine Learning']
    },
    {
      title: 'Web3 Builders Jam',
      platform: 'Unstop',
      link: 'https://unstop.com/hackathons/web3-builders',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      mode: 'offline',
      tags: ['Web3', 'Blockchain']
    },
    {
      title: 'FinTech Innovation Challenge',
      platform: 'Hack2Skill',
      link: 'https://hack2skill.com/fintech-innovation',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      mode: 'online',
      tags: ['FinTech', 'Web']
    }
  ];
  
  await processItems(mockData);
  console.log('Mock data saved to MongoDB.');
};

module.exports = { runScraper };