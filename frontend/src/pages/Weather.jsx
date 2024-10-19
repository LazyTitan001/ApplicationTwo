import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert error">{error}</div>;
  }

  if (weatherData.length === 0) {
    return <div>No weather data available.</div>;
  }

  return (
    <div>
      <h2>Current Weather</h2>
      {weatherData.map((cityWeather, index) => (
        <div key={index} className="card">
          <h3>{cityWeather.city}</h3>
          <p>Temperature: {cityWeather.temp.toFixed(1)}°C</p>
          <p>Feels Like: {cityWeather.feels_like.toFixed(1)}°C</p>
          <p>Condition: {cityWeather.main}</p>
          <p>Last Updated: {new Date(cityWeather.dt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Weather;