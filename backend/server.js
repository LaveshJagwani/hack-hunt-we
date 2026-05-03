require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const hackathons = require('./routes/hackathons');
const { initScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Note: For backwards compatibility with the existing MVP frontend, keep /api root and attach new router
app.use('/api', hackathons);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackhunt')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Initialize Scheduler logic
    initScheduler();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});