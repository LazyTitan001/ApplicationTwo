const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: String, required: true },
  tempSum: { type: Number, required: true },
  tempCount: { type: Number, required: true },
  avgTemp: { type: Number, required: true },
  tempMax: { type: Number, required: true },
  tempMin: { type: Number, required: true },
  conditions: [{ type: String }],
  dominantCondition: { type: String },
  humiditySum: { type: Number, required: true, default: 0 },
  windSpeedSum: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);