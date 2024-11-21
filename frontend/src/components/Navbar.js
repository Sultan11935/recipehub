// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in
  const role = localStorage.getItem('role'); // Get the user's role
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to intro home after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to={isAuthenticated ? '/home' : '/'}>RecipeHub</Link>
        </div>
        <ul className="navbar-list">
          {isAuthenticated && role === 'admin' && (
            <li className="navbar-item">
              <Link to="/admin">Admin Dashboard</Link>
            </li>
          )}
          {isAuthenticated && role !== 'admin' && (
            <li className="navbar-item">
              <Link to="/RecipeList">My Recipes</Link>
            </li>
          )}
          {isAuthenticated && (
            <>
              <li className="navbar-item">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="navbar-item">
                <button className="navbar-logout" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li className="navbar-item">
                <Link to="/login">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
