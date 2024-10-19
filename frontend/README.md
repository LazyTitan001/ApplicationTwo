# Weather Monitoring System

This project is a real-time weather monitoring system that fetches data from the OpenWeatherMap API, processes it, and displays current weather conditions, daily summaries, and alerts for major Indian cities.

## Features

- Real-time weather data for Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad
- Daily weather summaries with average, maximum, and minimum temperatures
- Temperature alerts when thresholds are exceeded
- Visualization of weather trends

## Setup

### Backend

1. Navigate to the `backend` directory
2. Run `npm install` to install dependencies
3. Create a `.env` file and add your OpenWeatherMap API key and MongoDB connection string
4. Run `npm start` to start the server

### Frontend

1. Navigate to the `frontend` directory
2. Run `npm install` to install dependencies
3. Update the `.env` file with your backend API URL if necessary
4. Run `npm start` to start the React development server

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Recharts
- API: OpenWeatherMap

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)