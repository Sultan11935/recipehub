// src/pages/AdminLanding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const AdminLanding = () => {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate('/manage-users');
  };

  const handleManageRecipes = () => {
    navigate('/manage-recipes');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  return (
    <div className="admin-landing-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage users, view reports, and oversee recipes.</p>

      <div className="admin-actions">
        <button className="admin-button" onClick={handleManageUsers}>
          Manage Users
        </button>
        <button className="admin-button" onClick={handleManageRecipes}>
          Manage Recipes
        </button>
        <button className="admin-button" onClick={handleViewReports}>
          View Reports
        </button>
      </div>
    </div>
  );
};

export default AdminLanding;
