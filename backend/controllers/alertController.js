const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAlert = async (city, message) => {
  try {
    const newAlert = new Alert({ city, message });
    await newAlert.save();
    console.log(`Alert created for ${city}: ${message}`);
  } catch (err) {
    console.error('Error creating alert:', err);
  }
};