import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Weather from "./pages/Weather";
import Summary from "./pages/Summary";
import AlertDisplay from "./pages/AlertDisplay";
import AlertSettings from "./pages/AlertSettings";
import './App.css';
import Forecast from './pages/Forecast';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Weather Monitoring System</h1>
        </header>
        <nav className="nav">
          <Link to="/weather">Weather</Link>
          <Link to="/summary">Summary</Link>
          <Link to="/AlertDisplay">Alerts</Link>
          <Link to="/alert-settings">Alert Settings</Link>
          <Link to="/forecast">Forecast</Link>
        </nav>
        <Routes>
        <Route path="/forecast" element={<Forecast />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/AlertDisplay" element={<AlertDisplay />} />
          <Route path="/alert-settings" element={<AlertSettings />} />
          <Route path="/" element={<Weather />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;