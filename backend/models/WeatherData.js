const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  city: { type: String, required: true },
  main: { type: String, required: true },
  temp: { type: Number, required: true },
  feels_like: { type: Number, required: true },
  dt: { type: Date, required: true }
});

module.exports = mongoose.model('WeatherData', WeatherDataSchema);