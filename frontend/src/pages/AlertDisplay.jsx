import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AlertDisplay = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/alerts`);
        setAlerts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch alerts');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Fetch alerts every minute
    const interval = setInterval(fetchAlerts, 60000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getAlertClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'alert-high';
      case 'medium':
        return 'alert-medium';
      default:
        return 'alert-low';
    }
  };

  if (loading) {
    return <div className="alert-container">
      <div className="loading">Loading alerts...</div>
    </div>;
  }

  if (error) {
    return <div className="alert-container">
      <div className="error">{error}</div>
    </div>;
  }

  return (
    <div className="alert-container">
      <h2>Weather Alerts</h2>
      <div className="alert-grid">
        {alerts.length === 0 ? (
          <div className="no-alerts">No alerts to display</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className={`alert-card ${getAlertClass(alert.severity)}`}
            >
              <div className="alert-icon">{getAlertIcon(alert.severity)}</div>
              <div className="alert-content">
                <h3 className="alert-city">{alert.city}</h3>
                <p className="alert-message">{alert.message}</p>
                <p className="alert-timestamp">
                  {format(new Date(alert.timestamp), 'MMMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertDisplay;