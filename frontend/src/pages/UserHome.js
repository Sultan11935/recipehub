import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const UserHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      alert('Please log in to access the home page.');
      navigate('/login');
      return;
    }

    // Redirect admin users to the admin dashboard
    if (role === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="userhome-container">
      <h2>Welcome Back to Recipe Hub!</h2>
      <p>Manage, edit, and share your favorite recipes with ease.</p>
      <div className="userhome-actions">
        <button className="userhome-button" onClick={() => navigate('/RecipeList')}>
          View My Recipes
        </button>
        <button className="userhome-button" onClick={() => navigate('/add-recipe')}>
          Add New Recipe
        </button>
      </div>
    </div>
  );
};

export default UserHome;
