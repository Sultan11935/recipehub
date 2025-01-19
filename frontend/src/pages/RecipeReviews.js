import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRatingsForRecipe } from '../services/api';
import '../App.css';

const RecipeReviews = () => {
  const { recipeId } = useParams(); // Use recipeId from the URL
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recipeId) {
      setError('Invalid recipe ID.');
      setLoading(false);
      return;
    }

    const fetchReviews = async (page) => {
      setLoading(true);
      setError(null); // Clear previous errors before fetching
      try {
        const response = await getRatingsForRecipe(recipeId, page);

        setReviews(response.data.reviews || []);
        setRecipeName(response.data.recipeName || 'Unknown Recipe');
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching reviews:', err.message);
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews(currentPage);
  }, [recipeId, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const truncateText = (text, length = 100) =>
    text.length > length ? `${text.slice(0, length)}...` : text;

  return (
    <div className="reviews-page">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <h2 className="reviews-title">{recipeName} - Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {reviews.length === 0 && <p>No reviews yet. Be the first to leave a review!</p>}
          {reviews.length > 0 && (
            <div className="reviews-card-container">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <h3 className="review-user">{review.username || 'Anonymous'}</h3>
                    <span className="review-rating">⭐ {review.Rating}/5</span>
                  </div>
                  <p
                    className="review-text"
                    title={review.Review || 'No text provided'}
                  >
                    {truncateText(review.Review || 'No text provided')}
                  </p>
                  <div className="review-footer">
                    <small className="review-date">
                      Submitted: {new Date(review.DateSubmitted).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        </>
      )}
    </div>
  );
};

export default RecipeReviews;
