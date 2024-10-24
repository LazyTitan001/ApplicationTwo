const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const weatherRoutes = require('./routes/weatherRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const thresholdRoutes = require('./routes/thresholdRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const { fetchWeatherData } = require('./utils/weatherApi');
const { fetchAndStoreForecast } = require('./utils/forecastApi');
const { checkAlerts } = require('./utils/alertChecker');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize thresholds if none exist
const initializeThresholds = async () => {
  try {
    const Threshold = require('./models/Threshold');
    const existingThresholds = await Threshold.countDocuments();
    
    if (existingThresholds === 0) {
      const defaultThresholds = [
        {
          city: 'Delhi',
          temperatureThreshold: 35,
          weatherCondition: 'Rain',
          enabled: true
        },
        {
          city: 'Mumbai',
          temperatureThreshold: 32,
          weatherCondition: 'Rain',
          enabled: true
        }
      ];
      
      await Threshold.insertMany(defaultThresholds);
      console.log('Default thresholds initialized');
    }
  } catch (error) {
    console.error('Error initializing thresholds:', error);
  }
};

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/thresholds', thresholdRoutes);
app.use('/api/forecast', forecastRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Initialize the system
const initializeSystem = async () => {
  console.log('Initializing system...');
  
  await initializeThresholds();
  
  try {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    
    for (const city of cities) {
      console.log(`Initializing data for ${city}...`);
      const weatherData = await fetchWeatherData(city);
      await fetchAndStoreForecast(city);
      await checkAlerts(weatherData);
      console.log(`Initialization completed for ${city}`);
    }
    
    console.log('Initial system setup completed');
  } catch (error) {
    console.error('Error in initial system setup:', error);
  }
};

// Run initialization when server starts
initializeSystem();

// Schedule regular weather and forecast checks
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled checks...');
  try {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    
    for (const city of cities) {
      console.log(`Updating data for ${city}...`);
      const weatherData = await fetchWeatherData(city);
      await checkAlerts(weatherData);
      await fetchAndStoreForecast(city);
      console.log(`Update completed for ${city}`);
    }
    
    console.log('Scheduled checks completed successfully');
  } catch (error) {
    console.error('Error in scheduled checks:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
