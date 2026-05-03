require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const hackathonRoutes = require('./routes/hackathonRoutes');
const { runScraper } = require('./services/scraperService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', hackathonRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackhunt')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Initial scrape on startup
    runScraper();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Cron Job: Run scraper every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled scraper...');
  runScraper();
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});