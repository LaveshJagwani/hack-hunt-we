const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');
const { updateDatabase } = require('../services/scheduler');

// GET /hackathons -> returns stored data
router.get('/hackathons', async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    res.json({ data: hackathons, count: hackathons.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
});

// GET /search?q= -> search by title/tags
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const hackathons = await Hackathon.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json({ data: hackathons, count: hackathons.length });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /filter?platform=&mode=
router.get('/filter', async (req, res) => {
  try {
    const { platform, mode } = req.query;
    const filter = {};
    if (platform) filter.platform = { $regex: new RegExp(`^${platform}$`, 'i') };
    if (mode) filter.mode = { $regex: new RegExp(`^${mode}$`, 'i') };

    const hackathons = await Hackathon.find(filter).sort({ createdAt: -1 });
    res.json({ data: hackathons, count: hackathons.length });
  } catch (error) {
    res.status(500).json({ error: 'Filter failed' });
  }
});

// GET /refresh -> triggers scraping manually
router.get('/refresh', async (req, res) => {
  try {
    console.log('Manual refresh triggered.');
    // Start non-blocking so the HTTP request doesn't timeout
    updateDatabase(); 
    res.json({ message: 'Scraping job started successfully. Check server logs for progress. Data will merge momentarily.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger refresh' });
  }
});

module.exports = router;
