const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const weatherRoutes = require('./routes/weatherRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const { fetchWeatherData } = require('./utils/weatherApi');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/weather', weatherRoutes);
app.use('/api/summary', summaryRoutes);

// Fetch weather data immediately when the server starts
fetchWeatherData().catch(error => console.error('Initial weather data fetch failed:', error));

cron.schedule('*/5 * * * *', async () => {
  console.log('Fetching weather data...');
  try {
    await fetchWeatherData();
    console.log('Weather data fetched and processed successfully');
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});