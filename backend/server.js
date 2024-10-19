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
console.log('Initiating initial weather data fetch...');
fetchWeatherData()
  .then(() => console.log('Initial weather data fetch completed successfully'))
  .catch(error => console.error('Initial weather data fetch failed:', error));

// Schedule weather data fetching every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Scheduled task: Fetching weather data...');
  try {
    await fetchWeatherData();
    console.log('Scheduled weather data fetch completed successfully');
  } catch (error) {
    console.error('Error in scheduled weather data fetch:', error);
  }
});

// Endpoint to manually trigger data refresh
app.get('/api/refresh', async (req, res) => {
  console.log('Manual refresh requested');
  try {
    const updatedData = await fetchWeatherData();
    console.log('Manual refresh completed successfully');
    res.json(updatedData);
  } catch (error) {
    console.error('Error in manual refresh:', error);
    res.status(500).json({ message: 'Error refreshing data', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});