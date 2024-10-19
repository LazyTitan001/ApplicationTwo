const WeatherData = require('../models/WeatherData');

exports.getWeather = async (req, res) => {
  try {
    const weather = await WeatherData.aggregate([
      { $sort: { dt: -1 } },
      { $group: { 
        _id: "$city",
        doc: { $first: "$$ROOT" }
      }},
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { city: 1 } }
    ]);
    
    console.log('Sending weather data:', weather);
    res.json(weather);
  } catch (err) {
    console.error('Error in getWeather:', err);
    res.status(500).json({ message: err.message });
  }
};