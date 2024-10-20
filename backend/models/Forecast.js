// models/Forecast.js
const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  dt: { type: Date, required: true },
  temp: { type: Number, required: true },
  feels_like: { type: Number, required: true },
  temp_min: { type: Number, required: true },
  temp_max: { type: Number, required: true },
  humidity: { type: Number, required: true },
  main: { type: String, required: true },
  description: { type: String, required: true },
  wind_speed: { type: Number, required: true },
  probability_of_precipitation: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

ForecastSchema.index({ city: 1, dt: 1 });

module.exports = mongoose.model('Forecast', ForecastSchema);