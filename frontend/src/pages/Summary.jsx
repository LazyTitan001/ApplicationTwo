import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Summary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/summary`);
        console.log('Received summary data:', response.data); // Add this line for debugging
        setSummaryData(response.data);
      } catch (err) {
        console.error('Error fetching summary data:', err);
        setError('Error fetching summary data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert error">{error}</div>;
  }

  if (summaryData.length === 0) {
    return <div>No summary data available.</div>;
  }

  return (
    <div>
      <h2>Daily Weather Summary</h2>
      {summaryData.map((summary, index) => (
        <div key={index} className="card">
          <h3>{summary.city}</h3>
          <p>Date: {new Date(summary.date).toLocaleDateString()}</p>
          <p>Average Temperature: {(summary.tempSum / summary.tempCount).toFixed(1)} °C</p>
          <p>Max Temperature: {summary.tempMax.toFixed(1)} °C</p>
          <p>Min Temperature: {summary.tempMin.toFixed(1)} °C</p>
          <p>Dominant Condition: {summary.dominantCondition}</p>
        </div>
      ))}
    </div>
  );
};

export default Summary;