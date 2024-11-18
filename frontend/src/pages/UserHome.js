// src/pages/UserHome.js
import React from 'react';
import '../App.css';

const UserHome = () => {
  return (
    <div className="userhome-container">
      <h2>Welcome Back to Recipe Hub!</h2>
      <p>Manage, edit, and share your favorite recipes with ease.</p>
      <div className="userhome-actions">
        <button className="userhome-button" onClick={() => window.location.href = '/RecipeList'}>
          View My Recipes
        </button>
        <button className="userhome-button" onClick={() => window.location.href = '/add-recipe'}>
          Add New Recipe
        </button>
      </div>
    </div>
  );
};

export default UserHome;
