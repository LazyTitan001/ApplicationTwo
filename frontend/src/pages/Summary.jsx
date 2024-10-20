import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Summary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/summary`);
        console.log('Received summary data:', response.data);
        setSummaryData(response.data);
      } catch (err) {
        console.error('Error fetching summary data:', err);
        setError('Error fetching summary data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
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
    return <div className="summary-container">
      <div className="loading">Loading summary data...</div>
    </div>;
  }

  if (error) {
    return <div className="summary-container">
      <div className="alert error">{error}</div>
    </div>;
  }

  if (summaryData.length === 0) {
    return <div className="summary-container">
      <div className="no-data">No summary data available.</div>
    </div>;
  }

  return (
    <div className="summary-container">
      <h2>Daily Weather Summary</h2>
      <div className="summary-grid">
        {summaryData.map((summary, index) => (
          <div key={index} className="summary-card">
            <div className="summary-header">
              <h3>{summary.city}</h3>
              <div className="date-display">
                <span className="day">{format(new Date(summary.date), 'EEEE')}</span>
                <span className="date">{format(new Date(summary.date), 'MMMM d, yyyy')}</span>
              </div>
            </div>
            <div className="summary-details">
              <div className="summary-icon">
                {getWeatherIcon(summary.dominantCondition)}
              </div>
              <div className="summary-info">
                <p className="avg-temp">Avg: {(summary.tempSum / summary.tempCount).toFixed(1)}°C</p>
                <p className="temp-range">
                  <span className="max-temp">Max: {summary.tempMax.toFixed(1)}°C</span>
                  <span className="min-temp">Min: {summary.tempMin.toFixed(1)}°C</span>
                </p>
                <p className="condition">{summary.dominantCondition}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;