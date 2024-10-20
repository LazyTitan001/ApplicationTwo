// routes/forecastRoutes.js
const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

// Test route to verify the endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Forecast route is working' });
});

router.get('/', forecastController.getForecast);

module.exports = router;