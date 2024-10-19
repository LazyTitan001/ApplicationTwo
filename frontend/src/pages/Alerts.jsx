import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/alerts`);
        setAlerts(response.data);
      } catch (err) {
        setError('Error fetching alerts: ' + err.message);
        console.error(err);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div>
      <h2>Weather Alerts</h2>
      {error && <div className="alert error">{error}</div>}
      {alerts.length === 0 ? (
        <p>No active alerts at this time.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index} className="alert">
              {alert}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alerts;