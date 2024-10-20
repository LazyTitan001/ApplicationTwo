// utils/forecastApi.js
const axios = require('axios');
const Forecast = require('../models/Forecast');

const fetchAndStoreForecast = async (city) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key is not configured');
    }

    console.log(`Fetching forecast for ${city}`);
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${apiKey}`
    );

    if (!response.data || !response.data.list) {
      throw new Error('Invalid response from OpenWeather API');
    }

    // Delete existing forecasts for this city
    await Forecast.deleteMany({ city });

    const forecasts = response.data.list.map(item => ({
      city,
      dt: new Date(item.dt * 1000),
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      humidity: item.main.humidity,
      main: item.weather[0].main,
      description: item.weather[0].description,
      wind_speed: item.wind.speed,
      probability_of_precipitation: item.pop || 0
    }));

    await Forecast.insertMany(forecasts);
    console.log(`Successfully stored ${forecasts.length} forecasts for ${city}`);
    return forecasts;
  } catch (error) {
    console.error(`Error in fetchAndStoreForecast for ${city}:`, error);
    throw error;
  }
};

module.exports = { fetchAndStoreForecast };