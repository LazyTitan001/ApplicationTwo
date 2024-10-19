const WeatherData = require('../models/WeatherData');

exports.getWeather = async (req, res) => {
  try {
    const weather = await WeatherData.find().sort({ dt: -1 }).limit(6);  // Get latest data for 6 cities
    console.log('Sending weather data:', weather);
    res.json(weather);
  } catch (err) {
    console.error('Error in getWeather:', err);
    res.status(500).json({ message: err.message });
  }
};