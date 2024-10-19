import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the base URL for your backend API
const BASE_URL = 'http://localhost:3000/api'; // Change this to your actual backend URL

const AlertSettings = () => {
  const [cities, setCities] = useState(['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']);
  const [thresholds, setThresholds] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [message, setMessage] = useState('');

  // Weather conditions dropdown options
  const weatherConditions = [
    'Thunderstorm',    
    'Drizzle',         
    'Rain',           
    'Snow',           
    'Mist',            
    'Clear',          
    'Clouds'           
];

  useEffect(() => {
    // Load existing thresholds from backend
    const fetchThresholds = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/thresholds`); // Update the URL
        setThresholds(response.data);
      } catch (error) {
        console.error('Error fetching thresholds:', error);
      }
    };
    fetchThresholds();
  }, []);

  const handleAddCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity]);
      setNewCity('');
    }
  };

  const handleThresholdChange = (city, field, value) => {
    const updatedThresholds = [...thresholds];
    const existingThreshold = updatedThresholds.find(t => t.city === city);

    if (existingThreshold) {
      existingThreshold[field] = field === 'temperatureThreshold' ? Number(value) : value;
    } else {
      updatedThresholds.push({
        city,
        temperatureThreshold: field === 'temperatureThreshold' ? Number(value) : null,
        weatherCondition: field === 'weatherCondition' ? value : '',
        enabled: true
      });
    }

    setThresholds(updatedThresholds);
  };

  const handleSave = async () => {
    try {
      await axios.post(`${BASE_URL}/thresholds`, { thresholds }); // Update the URL
      setMessage('Alert settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Weather Alert Settings</h1>
      </div>
      <div className="card">
        <div className="add-city-section">
          <h2>Add New City</h2>
          <div className="input-group">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name"
              className="input"
            />
            <button onClick={handleAddCity} className="button">Add City</button>
          </div>
        </div>

        <div className="thresholds-section">
          <h2>Alert Thresholds</h2>
          {cities.map(city => (
            <div key={city} className="threshold-card">
              <h3>{city}</h3>
              <div className="threshold-inputs">
                <div className="input-group">
                  <label>Temperature Threshold (°C)</label>
                  <input
                    type="number"
                    onChange={(e) => handleThresholdChange(city, 'temperatureThreshold', e.target.value)}
                    value={thresholds.find(t => t.city === city)?.temperatureThreshold || ''}
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label>Weather Condition</label>
                  <select
                    onChange={(e) => handleThresholdChange(city, 'weatherCondition', e.target.value)}
                    value={thresholds.find(t => t.city === city)?.weatherCondition || ''}
                    className="input"
                  >
                    <option value="">Select condition</option>
                    {weatherConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="button save-button">Save Settings</button>
        {message && <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      </div>
    </div>
  );
};

export default AlertSettings;
