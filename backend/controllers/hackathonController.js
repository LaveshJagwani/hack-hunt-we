const Hackathon = require('../models/Hackathon');

// GET /hackathons -> return all
const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
};

// GET /hackathons/:id -> detailed view
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathon' });
  }
};

// GET /search?q= -> search by title/tags
const searchHackathons = async (req, res) => {
  try {
    const query = req.query.q || '';
    const hackathons = await Hackathon.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// GET /filter?platform=&mode=
const filterHackathons = async (req, res) => {
  try {
    const { platform, mode } = req.query;
    const filter = {};
    if (platform) filter.platform = { $regex: new RegExp(`^${platform}$`, 'i') };
    if (mode) filter.mode = { $regex: new RegExp(`^${mode}$`, 'i') };

    const hackathons = await Hackathon.find(filter).sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: 'Filter failed' });
  }
};

module.exports = {
  getHackathons,
  getHackathonById,
  searchHackathons,
  filterHackathons
};