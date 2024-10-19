const axios = require('axios');

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

async function fetchWeatherData() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const weatherData = [];

  for (const city of cities) {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}`);
      const data = response.data;
      weatherData.push({
        city: data.name,
        main: data.weather[0].main,
        temp: data.main.temp - 273.15, // Convert to Celsius
        feels_like: data.main.feels_like - 273.15,
        dt: data.dt
      });
    } catch (error) {
      console.error(`Error fetching data for ${city}:`, error);
    }
  }

  return weatherData;
}

module.exports = { fetchWeatherData };