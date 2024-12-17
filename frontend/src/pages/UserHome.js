import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPublicRecipes } from '../services/api';
import '../App.css';

const UserHome = () => {
  const navigate = useNavigate();

  // Load data from sessionStorage if available
  const [recipes, setRecipes] = useState(
    JSON.parse(sessionStorage.getItem('userHomeRecipes')) || []
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem('userHomeCurrentPage')) || 1
  );
  const [totalPages, setTotalPages] = useState(
    parseInt(sessionStorage.getItem('userHomeTotalPages')) || 1
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!localStorage.getItem('token');
  const recipesPerPage = 20; // Number of recipes per page

  useEffect(() => {
    const fetchRecipes = async (page) => {
      setLoading(true);
      try {
        const response = await fetchPublicRecipes(page);
        setRecipes(response.data.recipes || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
  
        // Save state to sessionStorage
        sessionStorage.setItem('currentRecipes', JSON.stringify(response.data.recipes));
        sessionStorage.setItem('currentPage', response.data.currentPage);
        sessionStorage.setItem('totalPages', response.data.totalPages);
      } catch (err) {
        console.error('Error fetching recipes:', err.message);
        setError('Failed to load recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes(currentPage);
  }, [currentPage]); // Trigger when currentPage changes
  

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      sessionStorage.setItem('currentPage', newPage); // Save updated page
    }
  };
  
  const handleAddReview = (recipeId) => {
    if (!isAuthenticated) {
      alert('Please log in to add a review.');
      navigate('/login');
    } else {
      navigate(`/recipes/${recipeId}/add-review`);
    }
  };

  return (
    <div className="userhome-container">
      <div className="userhome-card">
        <h1 className="userhome-title">Welcome Back to Recipe Hub!</h1>
        <p className="userhome-subtitle">Manage, edit, and share your favorite recipes with ease.</p>
        <div className="userhome-actions">
          <button className="userhome-button" onClick={() => navigate('/RecipeList')}>
            View My Recipes
          </button>
          <button className="userhome-button" onClick={() => navigate('/my-ratings')}>
            My Reviews
          </button>
          <button className="userhome-button" onClick={() => navigate('/add-recipe')}>
            Add New Recipe
          </button>
        </div>
      </div>

      <div className="cards-container">
        {/* Top 10 Popular Recipes Card */}
        <div className="top-recipes-card" onClick={() => navigate('/top-recipes')}>
          <h2 className="top-recipes-title">Top 10 Popular Recipes</h2>
          <p>Discover the most loved recipes voted by our community!</p>
          <button className="top-recipes-button">View Top Recipes</button>
        </div>

        {/* Top 10 Fastest Recipes Card */}
        <div className="top-recipes-card" onClick={() => navigate('/fastest-recipes')}>
          <h2 className="top-recipes-title">Top 10 Fastest Recipes</h2>
          <p>Discover the quickest recipes to prepare!</p>
          <button className="top-recipes-button">View Fastest Recipes</button>
        </div>

        {/* Top 10 Active Users Card */}
        <div className="top-recipes-card" onClick={() => navigate('/reports/top-active-users')}>
          <h2 className="top-recipes-title">Top 10 Active Users</h2>
          <p>Explore the most active users contributing reviews to our platform!</p>
          <button className="top-recipes-button">View Top Active Users</button>
        </div>
      </div>


      {/* Explore Recipes Section */}
      <h2 className="explore-title">Explore Recipes</h2>

      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : recipes.length > 0 ? (
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="recipe-card">
              {/* Recipe Title with Correct Index */}
              <h3 className="recipe-title">
                {index + 1 + (currentPage - 1) * recipesPerPage}. {recipe.Name}
              </h3>

              {/* Recipe Description and Submitter */}
              <div className="recipe-description-card">
                <p>
                  <strong>Description:</strong> {recipe.Description || 'No description available.'}
                </p>
                <button
                  className="view-more-button"
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                >
                  View More
                </button>
                <p>
                  <strong>Submitted by:</strong> {recipe.user?.AuthorName || 'Anonymous'}
                </p>
              </div>

              {/* Rating Section */}
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
        <p>No recipes available.</p>
      )}

      {/* Pagination Section */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserHome;
