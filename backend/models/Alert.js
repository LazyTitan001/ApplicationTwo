const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  city: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);