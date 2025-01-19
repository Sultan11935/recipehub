import React, { useState, useEffect } from 'react';
import { fetchTopPopularRecipes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const TopPopularRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token'); // Check login status

  const handleAddReview = (recipeId) => {
    if (!isAuthenticated) {
      alert('Please log in to add a review.');
      navigate('/login');
    } else {
      navigate(`/recipes/${recipeId}/add-review`);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetchTopPopularRecipes();
        console.log('Fetched Popular Recipes:', response.data);
        setRecipes(response.data || []); // Ensure fallback to an empty array
        setError(null); // Clear any existing errors
      } catch (err) {
        console.error('Error fetching top popular recipes:', err.message);
        setError('Failed to load popular recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="top-popular-recipes-container">
      <h1 className="page-title">Top 10 Popular Recipes</h1>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading popular recipes...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : recipes.length > 0 ? (
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="recipe-card">
              <h3 className="recipe-title">
                {index + 1}. {recipe.Name}
              </h3>
              <div className="recipe-description-card">
                <p className="truncate-description">
                  <strong>Description:</strong> {recipe.Description || 'No description available.'}
                </p>
                <button
                  className="view-more-button"
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                >
                  View Recipe
                </button>
                <p>
                  <strong>Submitted by:</strong> {recipe.username || 'Anonymous'}
                </p>
              </div>
              <div className="rating-card">
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
        <div className="no-data-container">
          <p>No popular recipes available at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default TopPopularRecipes;
