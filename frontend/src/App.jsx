import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Weather from "./pages/Weather";
import Summary from "./pages/Summary";
import Alerts from "./pages/Alerts";
import './App.css';

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
          <Link to="/alerts">Alerts</Link>
        </nav>
        <Routes>
          <Route path="/weather" element={<Weather />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/" element={<Weather />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;