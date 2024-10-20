import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Forecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

  useEffect(() => {
    fetchForecasts();
  }, [selectedCity]);

  const fetchForecasts = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = 'http://localhost:3000/api/forecast';
      console.log('Fetching from:', apiUrl, 'for city:', selectedCity);
      
      const response = await axios.get(apiUrl, {
        params: { city: selectedCity }
      });

      console.log('Forecast Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setForecasts(response.data);
      } else {
        throw new Error('Invalid forecast data received');
      }
    } catch (err) {
      console.error('Detailed error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch forecast data'
      );
    } finally {
      setLoading(false);
    }
  };

  const groupForecastsByDay = (forecasts) => {
    return forecasts.reduce((groups, forecast) => {
      const date = format(new Date(forecast.dt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(forecast);
      return groups;
    }, {});
  };

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
    return (
      <div className="forecast-container">
        <div className="loading">Loading forecast data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forecast-container">
        <div className="alert error">{error}</div>
      </div>
    );
  }

  const groupedForecasts = groupForecastsByDay(forecasts);

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h2>5-Day Weather Forecast</h2>
        <select 
          className="city-select"
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="forecast-grid">
        {Object.entries(groupedForecasts).map(([date, dayForecasts]) => (
          <div key={date} className="forecast-card">
            <h3>{format(new Date(date), 'EEEE, MMM d')}</h3>
            
            <div className="forecast-summary">
              <p>
                Temperature Range: {Math.min(...dayForecasts.map(f => f.temp_min)).toFixed(1)}°C 
                to {Math.max(...dayForecasts.map(f => f.temp_max)).toFixed(1)}°C
              </p>
              <p>
                Main conditions: {[...new Set(dayForecasts.map(f => f.main))].join(', ')}
              </p>
            </div>

            <div className="hourly-forecast">
              {dayForecasts.map((forecast, idx) => (
                <div key={idx} className="hourly-item">
                  <p>{format(new Date(forecast.dt), 'HH:mm')}</p>
                  <p>{getWeatherIcon(forecast.main)}</p>
                  <p className="temp">{forecast.temp.toFixed(1)}°C</p>
                  <p className="condition">{forecast.main}</p>
                  <p className="humidity">💧 {forecast.humidity}%</p>
                  <p className="wind">💨 {forecast.wind_speed} m/s</p>
                  <p className="rain">🌧️ {(forecast.probability_of_precipitation * 100).toFixed(0)}%</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {forecasts.length === 0 && !loading && !error && (
        <div className="no-data">
          No forecast data available for {selectedCity}
        </div>
      )}
    </div>
  );
};

export default Forecast;