# Real-Time Weather Monitoring System

A real-time data processing system for monitoring weather conditions across major Indian metros, featuring data aggregation, rollups, and smart alerting capabilities.

## Architecture Overview

### Tech Stack
- **Frontend**: React.js with Recharts for visualizations
- **Backend**: Node.js with Express
- **Database**: MongoDB (for storing weather data and aggregations)
- **API Integration**: OpenWeatherMap API

### System Components
1. **Data Collector Service**
   - Polls OpenWeatherMap API
   - Manages API rate limiting
   - Initial data validation

2. **Data Processor Service**
   - Temperature conversion
   - Aggregation calculations
   - Threshold monitoring

3. **Alert Manager**
   - Threshold evaluation
   - Alert generation
   - Notification dispatch

4. **Analytics Engine**
   - Daily rollups
   - Trend analysis
   - Weather pattern detection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- OpenWeatherMap API key

### Installation
1. MongoDB Setup
```bash
# Ubuntu
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify installation
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```
2. Backend Setup
```bash # Clone the repository
git clone <your-repo-url>
cd rule-engine-ast

# Install backend dependencies
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations

# Start the server
npm run dev
```
3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

