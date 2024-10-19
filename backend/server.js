const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const weatherRoutes = require('./routes/weatherRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const thresholdRoutes = require('./routes/thresholdRoutes'); // Add this
const { fetchWeatherData } = require('./utils/weatherApi');
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
        // Add more default thresholds as needed
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
app.use('/api/thresholds', thresholdRoutes); // Add this

// Initialize the system
const initializeSystem = async () => {
  console.log('Initializing system...');
  
  // Initialize default thresholds
  await initializeThresholds();
  
  // Initial weather data fetch and alert check
  try {
    const weatherData = await fetchWeatherData();
    console.log('Initial weather data fetch completed');
    await checkAlerts(weatherData);
    console.log('Initial alert check completed');
  } catch (error) {
    console.error('Error in initial system setup:', error);
  }
};

// Run initialization when server starts
initializeSystem();

// Schedule regular weather checks and alert generation
// Running every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled weather check...');
  try {
    const weatherData = await fetchWeatherData();
    await checkAlerts(weatherData);
    console.log('Scheduled check completed successfully');
  } catch (error) {
    console.error('Error in scheduled check:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;