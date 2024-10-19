const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const weatherRoutes = require('./routes/weatherRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const { fetchWeatherData } = require('./utils/weatherApi');
const { checkAlerts } = require('./utils/alertChecker');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/weather', weatherRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/alerts', alertRoutes);

// Fetch weather data and check for alerts immediately when the server starts
console.log('Initiating initial weather data fetch and alert check...');
fetchWeatherData()
  .then(async (weatherData) => {
    console.log('Initial weather data fetch completed successfully');
    await checkAlerts(weatherData);
    console.log('Initial alert check completed');
  })
  .catch(error => console.error('Initial weather data fetch or alert check failed:', error));

// Schedule weather data fetching and alert checking every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Scheduled task: Fetching weather data and checking alerts...');
  try {
    const weatherData = await fetchWeatherData();
    console.log('Scheduled weather data fetch completed successfully');
    await checkAlerts(weatherData);
    console.log('Scheduled alert check completed');
  } catch (error) {
    console.error('Error in scheduled weather data fetch or alert check:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});