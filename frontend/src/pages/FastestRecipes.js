import React, { useState, useEffect } from 'react';
import { fetchFastestRecipes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// Updated parseDuration function
const parseDuration = (duration, type) => {
  if (!duration || typeof duration !== 'string' || duration === 'N/A') {
    return type === 'PrepTime' ? 'Not Needed' : 'Not Needed';
  }

  // Check if it's already numeric
  if (!isNaN(duration)) {
    const totalMinutes = parseInt(duration, 10);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} ${hours > 1 ? 'hours' : 'hour'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);

    return parts.length > 0 ? parts.join(' ') : type === 'PrepTime' ? 'Not Needed' : 'Not Needed';
  }

  // Parse ISO 8601 Duration (PT1H30M)
  const regex = /P(?:T(?:(\d+)H)?(?:(\d+)M)?)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return type === 'PrepTime' ? 'Not Needed' : 'Not Needed';
  }

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;

  const parts = [];
  if (hours > 0) parts.push(`${hours} ${hours > 1 ? 'hours' : 'hour'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);

  return parts.length > 0 ? parts.join(' ') : type === 'PrepTime' ? 'Not Needed' : 'Not Needed';
};


const FastestRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token');

  const handleAddReview = (recipeId) => {
    if (!isAuthenticated) {
      alert('Please log in to add a review.');
      navigate('/login');
    } else {
      navigate(`/recipes/${recipeId}/add-review`);
    }
  };

  useEffect(() => {
    const loadFastestRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetchFastestRecipes();
  
        // Filter out recipes with invalid TotalTime
        const validRecipes = response.data.filter(
          (recipe) => recipe.TotalTimeNumeric > 0 && recipe.TotalTime
        );
  
        setRecipes(validRecipes);
      } catch (err) {
        console.error('Error fetching fastest recipes:', err.message);
        setError('Failed to load fastest recipes.');
      } finally {
        setLoading(false);
      }
    };
  
    loadFastestRecipes();
  }, []);
  

  return (
    <div className="fastest-recipes-container">
      <h1 className="page-title">Top 10 Fastest Recipes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : recipes.length > 0 ? (
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="recipe-card">
              <h3 className="recipe-title">
                {index + 1}. {recipe.Name}
              </h3>
              <div className="recipe-description-card">
                <p>
                  <strong>Description:</strong> {recipe.Description || 'No description available.'}
                </p>
                <button
                  className="view-more-button"
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                >
                  View Recipe
                </button>
                <p>
                  <strong>Submitted by:</strong> {recipe.SubmittedBy || 'Anonymous'}
                </p>
              </div>
              <div className="rating-card">
                <p>
                  <strong>Total Time:</strong>{' '}
                  {recipe.TotalTimeNumeric
                    ? parseDuration(recipe.TotalTimeNumeric.toString())
                    : parseDuration(recipe.TotalTime)}
                </p>
                <p>
                  <strong>Prep Time:</strong> {parseDuration(recipe.PrepTime, 'PrepTime')} |{' '}
                  <strong>Cook Time:</strong> {parseDuration(recipe.CookTime, 'CookTime')}
                </p>
                <p>
                  <strong>Aggregated Rating:</strong> {recipe.AggregatedRating || 'N/A'}
                </p>
                <p>
                  <strong>Review Count:</strong> {recipe.ReviewCount || 0}
                </p>
                <div className="rating-buttons">
                  <button
                    className="view-reviews-button"
                    onClick={() => navigate(`/recipes/${recipe._id}/reviews`)}
                  >
                    View Reviews
                  </button>
                  <button
                    className="add-review-button"
                    onClick={() => handleAddReview(recipe._id)}
                  >
                    Add Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No fastest recipes available.</p>
      )}
    </div>
  );
};

export default FastestRecipes;
