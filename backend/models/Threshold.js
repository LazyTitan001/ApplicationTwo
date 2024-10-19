const mongoose = require('mongoose');

const ThresholdSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperatureThreshold: { type: Number },
  weatherCondition: { type: String },
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Threshold', ThresholdSchema);