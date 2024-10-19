import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) return <div className="loading">Loading alerts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="alert-display">
      <div className="alert-header">
        <h1>Weather Alerts</h1>
      </div>

      <div className="alerts-container">
        {alerts.length === 0 ? (
          <div className="no-alerts">No alerts to display</div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert._id} 
              className={`alert-item ${getAlertClass(alert.severity)}`}
            >
              <div className="alert-city">{alert.city}</div>
              <div className="alert-message">{alert.message}</div>
              <div className="alert-timestamp">
                {formatDate(alert.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertDisplay;