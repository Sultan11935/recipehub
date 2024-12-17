import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRatingsForLoggedInUser, updateRating, deleteRating } from '../services/api'; // Import deleteRating API
import '../App.css';

const UserReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(null); // Track which review is in edit mode
  const [editReviewData, setEditReviewData] = useState({ Rating: 0, Review: '' }); // Store edit data
  const navigate = useNavigate();

  useEffect(() => {
    loadRatings(page);
  }, [page]);

  // Fetch user ratings
  const loadRatings = async (page) => {
    setLoading(true);
    try {
      const response = await getRatingsForLoggedInUser(page);
      const validRatings = response.ratings.filter((rating) => rating.recipe !== null);
      setRatings(validRatings);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching ratings:', err.message);
      setError('Failed to load ratings.');
    } finally {
      setLoading(false);
    }
  };

  // Enter edit mode for a specific review
  const handleEditClick = (rating) => {
    setEditMode(rating._id);
    setEditReviewData({
      Rating: rating.Rating,
      Review: rating.Review || '',
    });
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setEditReviewData((prevData) => ({ ...prevData, Rating: rating }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save the updated review
  const handleSave = async (ratingId, recipeId) => {
    try {
      await updateRating(recipeId, editReviewData);
      alert('Review updated successfully!');
      setEditMode(null);
      loadRatings(page); // Reload reviews
    } catch (err) {
      console.error('Error updating review:', err.message);
      alert('Failed to update review. Please try again.');
    }
  };

  // Delete a review
  const handleDelete = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteRating(ratingId); // Call deleteRating API
      alert('Review deleted successfully!');
      loadRatings(page); // Reload reviews
    } catch (err) {
      console.error('Error deleting review:', err.message);
      alert('Failed to delete review. Please try again.');
    }
  };

  return (
    <div className="user-reviews-container">
      <h2 className="reviews-title">My Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : ratings.length > 0 ? (
        <div className="reviews-list">
          {ratings.map((rating, index) => (
            <div key={rating._id} className="review-card">
              {editMode === rating._id ? (
                // Inline Edit Mode
                <div className="edit-review-container">
                  <h3>Edit Review</h3>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= editReviewData.Rating ? 'filled' : ''}`}
                        onClick={() => handleStarClick(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    name="Review"
                    value={editReviewData.Review}
                    onChange={handleChange}
                    placeholder="Update your review here..."
                    className="review-textarea"
                  ></textarea>
                  <div className="button-container">
                    <button onClick={() => handleSave(rating._id, rating.recipe._id)}>
                      Save
                    </button>
                    <button onClick={() => setEditMode(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <h3>
                    {index + 1}. {rating.recipe?.Name || 'Unknown Recipe'}
                  </h3>
                  <p>
                    <strong>Rating:</strong> {rating.Rating}
                  </p>
                  <p>
                    <strong>Review:</strong> {rating.Review || 'No review provided'}
                  </p>
                  <div className="review-actions">
                    <button
                      className="view-recipe-button"
                      onClick={() => navigate(`/recipes/${rating.recipe?._id}`)}
                    >
                      View Recipe
                    </button>
                    <button
                      className="edit-review-button"
                      onClick={() => handleEditClick(rating)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-review-button"
                      onClick={() => handleDelete(rating._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
      <div className="pagination-container">
        <button
          className="btn-pagination"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn-pagination"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserReviews;
