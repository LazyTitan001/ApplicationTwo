import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/weather`);
        console.log('Received weather data:', response.data);
        setWeatherData(response.data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Error fetching weather data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (weatherMain) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '💨',
      'Tornado': '🌪️'
    };
    return icons[weatherMain] || '❓';
  };

  if (loading) {
    return <div className="weather-container">
      <div className="loading">Loading weather data...</div>
    </div>;
  }

  if (error) {
    return <div className="weather-container">
      <div className="alert error">{error}</div>
    </div>;
  }

  if (weatherData.length === 0) {
    return <div className="weather-container">
      <div className="no-data">No weather data available.</div>
    </div>;
  }

  return (
    <div className="weather-container">
      <h2>Current Weather</h2>
      <div className="weather-grid">
        {weatherData.map((cityWeather) => (
          <div key={cityWeather.city} className="weather-card">
            <h3>{cityWeather.city}</h3>
            <div className="weather-details">
              <div className="weather-icon">
                {getWeatherIcon(cityWeather.main)}
              </div>
              <div className="weather-info">
                <p className="temp">{cityWeather.temp.toFixed(1)}°C</p>
                <p className="feels-like">Feels like: {cityWeather.feels_like.toFixed(1)}°C</p>
                <p className="condition">{cityWeather.main}</p>
                <p className="humidity">💧 Humidity: {cityWeather.humidity}%</p>
                <p className="wind">💨 Wind: {cityWeather.wind_speed} m/s</p>
              </div>
            </div>
            <p className="last-updated">
              Last Updated: {format(new Date(cityWeather.dt), 'MMMM d, yyyy HH:mm')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;