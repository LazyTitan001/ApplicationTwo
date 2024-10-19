const Alert = require('../models/Alert');

const checkAlerts = async (weatherData) => {
  const alertThresholds = JSON.parse(localStorage.getItem('alertThresholds') || '[]');
  const newAlerts = [];

  for (const cityData of weatherData) {
    const threshold = alertThresholds.find(t => t.city === cityData.city);
    if (threshold) {
      if (cityData.temp > threshold.temperatureThreshold) {
        newAlerts.push({
          city: cityData.city,
          message: `Temperature alert: ${cityData.temp}°C exceeds threshold of ${threshold.temperatureThreshold}°C`
        });
      }
      if (cityData.main === threshold.weatherCondition) {
        newAlerts.push({
          city: cityData.city,
          message: `Weather condition alert: Current condition ${cityData.main} matches alert condition`
        });
      }
    }
  }

  // Save new alerts to the database
  for (const alert of newAlerts) {
    const newAlert = new Alert(alert);
    await newAlert.save();
  }

  return newAlerts;
};

module.exports = { checkAlerts };