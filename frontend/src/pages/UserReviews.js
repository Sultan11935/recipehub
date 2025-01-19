import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRatingsForLoggedInUser, updateRating, deleteRating } from '../services/api';
import '../App.css';

// Reusable ReviewCard Component
const ReviewCard = ({
  rating,
  index,
  page,
  itemsPerPage,
  editMode,
  editReviewData,
  handleEditClick,
  handleStarClick,
  handleChange,
  handleSave,
  handleDelete,
  navigate,
  setEditMode,
}) => {
  const adjustedIndex = index + 1 + (page - 1) * itemsPerPage; // Adjust index based on current page

  return (
    <div key={rating._id} className="review-card">
      {editMode === rating._id ? (
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
            <button onClick={() => handleSave(rating._id, rating.recipeId)}>Save</button>
            <button onClick={() => setEditMode(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3>
            {adjustedIndex}. {rating.recipeName || 'Unknown Recipe'}
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
              onClick={() => navigate(`/recipes/${rating.recipeId}`)}
            >
              View Recipe
            </button>
            <button className="edit-review-button" onClick={() => handleEditClick(rating)}>
              Edit
            </button>
            <button
              className="delete-review-button"
              onClick={() => handleDelete(rating.ReviewId, rating.recipeId)} // Pass both IDs correctly
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const UserReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(null);
  const [editReviewData, setEditReviewData] = useState({ Rating: 0, Review: '' });
  const navigate = useNavigate();

  const itemsPerPage = 10; // Number of reviews per page

  useEffect(() => {
    const loadRatings = async () => {
      setLoading(true);
      try {
        const response = await getRatingsForLoggedInUser(page);
        setRatings(response.ratings); // Ratings include recipeName from backend
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching ratings:', err.message);
        setError('Failed to load ratings.');
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [page]);

  const handleEditClick = (rating) => {
    setEditMode(rating._id);
    setEditReviewData({
      Rating: rating.Rating,
      Review: rating.Review || '',
    });
  };

  const handleStarClick = (rating) => {
    setEditReviewData((prev) => ({ ...prev, Rating: rating }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (ratingId, recipeId) => {
    try {
      await updateRating(recipeId, editReviewData);
      alert('Review updated successfully!');
      setEditMode(null);
      setRatings((prev) =>
        prev.map((rating) =>
          rating._id === ratingId ? { ...rating, ...editReviewData } : rating
        )
      );
    } catch (err) {
      console.error('Error updating review:', err.message);
      alert('Failed to update review. Please try again.');
    }
  };

  const handleDelete = async (ratingId, recipeId) => {
    console.log('Attempting to delete rating with ReviewId:', ratingId, 'for RecipeId:', recipeId);

    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      // Ensure the correct API call with both recipeId and reviewId
      await deleteRating(recipeId, ratingId);
      alert('Review deleted successfully!');
      setRatings((prev) => prev.filter((rating) => rating.ReviewId !== ratingId));
    } catch (err) {
      console.error('Error deleting review:', err.message);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="user-reviews-container">
      <h2 className="reviews-title">My Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : ratings.length > 0 ? (
        <div className="reviews-list">
          {ratings.map((rating, index) => (
            <ReviewCard
              key={rating._id}
              rating={rating}
              index={index}
              page={page}
              itemsPerPage={itemsPerPage}
              editMode={editMode}
              editReviewData={editReviewData}
              handleEditClick={handleEditClick}
              handleStarClick={handleStarClick}
              handleChange={handleChange}
              handleSave={handleSave}
              handleDelete={handleDelete}
              navigate={navigate}
              setEditMode={setEditMode}
            />
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
      <div className="pagination-container">
        <button
          className="btn-pagination"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn-pagination"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserReviews;
