const express = require('express');
const router = express.Router();
const {
  getHackathons,
  getHackathonById,
  searchHackathons,
  filterHackathons
} = require('../controllers/hackathonController');

router.get('/hackathons', getHackathons);
router.get('/search', searchHackathons);
router.get('/filter', filterHackathons);
router.get('/hackathons/:id', getHackathonById); // Keep routes with params at the end

module.exports = router;