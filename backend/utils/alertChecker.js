const Alert = require('../models/Alert');
const Threshold = require('../models/Threshold');

const checkAlerts = async (weatherData) => {
  try {
    // Fetch all thresholds from database
    const thresholds = await Threshold.find({ enabled: true });
    const newAlerts = [];

    for (const cityData of weatherData) {
      const cityThresholds = thresholds.filter(t => t.city === cityData.city);
      
      for (const threshold of cityThresholds) {
        // Check temperature threshold
        if (threshold.temperatureThreshold && cityData.temp > threshold.temperatureThreshold) {
          newAlerts.push({
            city: cityData.city,
            message: `Temperature alert: Current temperature ${cityData.temp}°C exceeds threshold of ${threshold.temperatureThreshold}°C`,
            severity: 'high'
          });
        }

        // Check weather condition
        if (threshold.weatherCondition && cityData.main === threshold.weatherCondition) {
          newAlerts.push({
            city: cityData.city,
            message: `Weather condition alert: ${cityData.main} condition detected`,
            severity: 'medium'
          });
        }
      }
    }

    // Save new alerts to database
    if (newAlerts.length > 0) {
      await Alert.insertMany(newAlerts);
      console.log(`${newAlerts.length} new alerts generated`);
    }

    return newAlerts;
  } catch (error) {
    console.error('Error checking alerts:', error);
    throw error;
  }
};

module.exports = { checkAlerts };