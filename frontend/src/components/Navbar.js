// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure you have global styles here if needed

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to intro home after logout
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to={isAuthenticated ? '/home' : '/'}>Home</Link> {/* Link to UserHome if logged in, otherwise intro home */}
        </li>
        {isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="navbar-item">
              <Link to="/RecipeList">My Recipes</Link>
            </li>
            <li className="navbar-item">
              <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
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
    </nav>
  );
};

export default Navbar;
