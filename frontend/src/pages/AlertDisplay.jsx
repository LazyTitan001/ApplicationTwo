import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertDisplay = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('/api/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000); // Fetch every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Weather Alerts</h1>
      </div>
      <div className="card">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="alert">
              <h3>{alert.city}</h3>
              <p>{alert.message}</p>
              <p>Triggered at: {new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No active alerts at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AlertDisplay;