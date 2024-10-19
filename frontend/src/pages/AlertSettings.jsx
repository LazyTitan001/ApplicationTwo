import React, { useState, useEffect } from 'react';

const AlertSettings = () => {
  const [cities, setCities] = useState(['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']);
  const [thresholds, setThresholds] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedThresholds = localStorage.getItem('alertThresholds');
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds));
    }
  }, []);

  const handleAddCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity]);
      setNewCity('');
    }
  };

  const handleThresholdChange = (city, field, value) => {
    const updatedThresholds = thresholds.map(threshold => 
      threshold.city === city ? { ...threshold, [field]: field === 'temperatureThreshold' ? Number(value) : value } : threshold
    );

    if (!updatedThresholds.some(t => t.city === city)) {
      updatedThresholds.push({ 
        city, 
        temperatureThreshold: field === 'temperatureThreshold' ? Number(value) : 0, 
        weatherCondition: field === 'weatherCondition' ? value : '' 
      });
    }

    setThresholds(updatedThresholds);
  };

  const handleSave = () => {
    localStorage.setItem('alertThresholds', JSON.stringify(thresholds));
    setMessage('Alert settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Alert Settings</h1>
      </div>
      <div className="card">
        <h2>Add New City</h2>
        <input
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Enter city name"
          className="input"
        />
        <button onClick={handleAddCity} className="button">Add City</button>
      </div>
      <div className="card">
        <h2>Set Thresholds</h2>
        {cities.map(city => (
          <div key={city} className="threshold-input">
            <h3>{city}</h3>
            <input
              type="number"
              placeholder="Temperature Threshold (°C)"
              onChange={(e) => handleThresholdChange(city, 'temperatureThreshold', e.target.value)}
              value={thresholds.find(t => t.city === city)?.temperatureThreshold || ''}
              className="input"
            />
            <input
              type="text"
              placeholder="Weather Condition"
              onChange={(e) => handleThresholdChange(city, 'weatherCondition', e.target.value)}
              value={thresholds.find(t => t.city === city)?.weatherCondition || ''}
              className="input"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="button">Save Settings</button>
      {message && <div className="alert success">{message}</div>}
    </div>
  );
};

export default AlertSettings;