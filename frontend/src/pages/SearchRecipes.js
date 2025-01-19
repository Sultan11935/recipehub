import React, { useState, useEffect, useCallback } from 'react';
import { searchRecipes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SearchRecipes = () => {
  const [query, setQuery] = useState(sessionStorage.getItem('searchQuery') || '');
  const [results, setResults] = useState(JSON.parse(sessionStorage.getItem('searchResults')) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('currentPage')) || 1);
  const [totalPages, setTotalPages] = useState(parseInt(sessionStorage.getItem('totalPages')) || 1);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token');
  const recipesPerPage = 10;

  const handleSearch = useCallback(
    async (newPage = 1) => {
      const cleanQuery = query.trim();
      if (!cleanQuery) {
        alert('Please enter a search term.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await searchRecipes(cleanQuery, newPage, recipesPerPage);

        // Prioritize exact matches and format results
        const sortedResults = response.data.recipes.sort((a, b) => {
          if (a.Name.toLowerCase() === cleanQuery.toLowerCase()) return -1;
          if (b.Name.toLowerCase() === cleanQuery.toLowerCase()) return 1;
          return 0;
        });

        const formattedResults = sortedResults.map((recipe) => ({
          ...recipe,
          SubmittedBy: recipe.SubmittedBy || 'Anonymous',
        }));

        setResults(formattedResults);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);

        // Save to sessionStorage
        sessionStorage.setItem('searchQuery', cleanQuery);
        sessionStorage.setItem('searchResults', JSON.stringify(formattedResults));
        sessionStorage.setItem('currentPage', response.data.currentPage);
        sessionStorage.setItem('totalPages', response.data.totalPages);
      } catch (err) {
        console.error('Error searching recipes:', err.message);
        setError('Failed to load recipes. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query, recipesPerPage]
  );

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    sessionStorage.clear(); // Clear session storage for search-related state
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      handleSearch(newPage);
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

  useEffect(() => {
    if (query && !results.length) {
      handleSearch(currentPage);
    }
  }, [currentPage, query, results.length, handleSearch]);

  return (
    <div className="search-container">
      <h2>Search Recipes</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, ingredient, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
        />
        <button onClick={() => handleSearch(1)}>Search</button>
        <button onClick={handleClearSearch} className="clear-button">
          Clear
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && results.length > 0 && (
        <div className="recipe-list">
          {results.map((recipe, index) => (
            <div key={recipe._id} className="recipe-card">
              <h3 className="recipe-title">
                {index + 1 + (currentPage - 1) * recipesPerPage}. {recipe.Name}
              </h3>
              <div className="recipe-description-card">
                <p className="truncate-description">
                  <strong>Description:</strong> {recipe.Description || 'No description available.'}
                </p>
                <button className="view-more-button" onClick={() => navigate(`/recipes/${recipe._id}`)}>
                  View Recipe
                </button>
                <p>
                  <strong>Submitted by:</strong> {recipe.username}
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
      )}

      {!loading && results.length === 0 && query && <p>No results found for "{query}".</p>}

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default SearchRecipes;
