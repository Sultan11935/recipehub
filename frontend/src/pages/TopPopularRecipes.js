import React, { useState, useEffect } from 'react';
import { fetchTopPopularRecipes } from '../services/api'; // Ensure this API call is imported
import { useNavigate } from 'react-router-dom';
import '../App.css';

const TopPopularRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if the user is logged in
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
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetchTopPopularRecipes();
        console.log('API Response:', response); // Log API response
        setRecipes(response.data); // Directly set fetched recipes
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
                  <strong>Submitted by:</strong> {recipe.SubmittedBy || 'Anonymous'}
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
        <p>No popular recipes available.</p>
      )}
    </div>
  );
};

export default TopPopularRecipes;
