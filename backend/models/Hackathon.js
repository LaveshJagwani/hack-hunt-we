const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  deadline: { type: String },
  mode: { type: String, default: 'online' },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);