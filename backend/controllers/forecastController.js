// controllers/forecastController.js
const Forecast = require('../models/Forecast');

exports.getForecast = async (req, res) => {
  try {
    const { city } = req.query;
    console.log('Received request for city:', city);

    if (!city) {
      return res.status(400).json({ message: 'City parameter is required' });
    }

    const forecasts = await Forecast.find({ city })
      .sort({ dt: 1 })
      .limit(40);

    console.log(`Found ${forecasts.length} forecasts for ${city}`);

    res.json(forecasts);
  } catch (err) {
    console.error('Error in getForecast:', err);
    res.status(500).json({ message: 'Failed to fetch forecast data', error: err.message });
  }
};