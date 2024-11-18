// src/pages/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Ensure global styles are imported

const Landing = () => (
  <div className="landing-container">
    <h2 className="landing-title">Welcome to Recipe Hub</h2>
    <p className="landing-subtitle">Your personal space to store, manage, and share recipes.</p>
    <div className="landing-buttons">
      <Link to="/login" className="landing-button">Login</Link>
      <Link to="/register" className="landing-button">Register</Link>
    </div>
  </div>
);

export default Landing;
