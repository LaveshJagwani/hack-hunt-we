require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const hackathons = require('./routes/hackathons');
const { initScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow deployed frontend and localhost dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // e.g. https://hackhunt-frontend.onrender.com
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Health check — so visiting the root URL shows API info
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HackHunt API is running 🚀',
    endpoints: [
      'GET /api/hackathons',
      'GET /api/top?limit=<number>',
      'GET /api/calendar',
      'POST /api/calendar/:id/save',
      'GET /api/calendar/:id/ics',
      'GET /api/search?q=<query>',
      'GET /api/filter?platform=<platform>&mode=<mode>',
      'GET /api/refresh',
      'POST /api/refresh',
    ],
  });
});

// Routes
app.use('/api', hackathons);

// Database connection — crash fast on bad URI so Render surfaces the error
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is not set.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    initScheduler();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
