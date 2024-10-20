const axios = require('axios');
const WeatherData = require('../models/WeatherData');
const DailySummary = require('../models/DailySummary');

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

async function fetchWeatherData() {
  const apiKey = process.env.API_KEY;
  console.log('Starting to fetch weather data for all cities');

  const fetchPromises = cities.map(async (city) => {
    try {
      console.log(`Fetching data for ${city}`);
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}`
      );
      const data = response.data;

      const weatherData = {
        city: data.name,
        main: data.weather[0].main,
        temp: (data.main.temp - 273.15).toFixed(1),
        feels_like: (data.main.feels_like - 273.15).toFixed(1),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        dt: new Date()
      };

      const weather = new WeatherData(weatherData);
      await weather.save();
      console.log(`Saved weather data for ${city}`);

      await updateDailySummary(city, weatherData);
      return weatherData;
    } catch (error) {
      console.error(`Error fetching data for ${city}:`, error.message);
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);
  const validResults = results.filter(result => result !== null);
  console.log(`Completed fetching weather data. Successful fetches: ${validResults.length}/${cities.length}`);
  return validResults;
}

async function updateDailySummary(city, weather) {
  const today = new Date().toISOString().split('T')[0];

  try {
    let summary = await DailySummary.findOne({ city, date: today });

    if (!summary) {
      summary = new DailySummary({
        city,
        date: today,
        tempSum: parseFloat(weather.temp),
        tempCount: 1,
        avgTemp: weather.temp,
        tempMax: weather.temp,
        tempMin: weather.temp,
        conditions: [weather.main],
        dominantCondition: weather.main,
        humiditySum: weather.humidity,
        windSpeedSum: weather.wind_speed
      });
    } else {
      summary.tempSum += parseFloat(weather.temp);
      summary.tempCount += 1;
      summary.avgTemp = (summary.tempSum / summary.tempCount).toFixed(1);
      
      summary.tempMax = Math.max(parseFloat(summary.tempMax), parseFloat(weather.temp)).toFixed(1);
      summary.tempMin = Math.min(parseFloat(summary.tempMin), parseFloat(weather.temp)).toFixed(1);
      
      summary.conditions.push(weather.main);
      summary.humiditySum += weather.humidity;
      summary.windSpeedSum += weather.wind_speed;

      const conditionCounts = summary.conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      }, {});

      summary.dominantCondition = Object.entries(conditionCounts)
        .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    }

    await summary.save();
    console.log(`Updated daily summary for ${city}`);
  } catch (error) {
    console.error(`Error updating daily summary for ${city}:`, error.message);
  }
}

module.exports = { fetchWeatherData };