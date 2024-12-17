import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addRating, updateRating, getRecipeById, getRatingsForRecipe } from '../services/api';
import '../App.css';

const AddReview = () => {
  const { recipeId } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [reviewData, setReviewData] = useState({ Rating: 0, Review: '' });
  const [existingReview, setExistingReview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Logged-in user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch recipe details
        const recipeResponse = await getRecipeById(recipeId);
        setRecipe(recipeResponse.data);

        // If the recipe belongs to the current user, block further operations
        if (recipeResponse.data.user?._id === userId) {
          setError("You cannot review your own recipe.");
          setLoading(false);
          return;
        }

        // Fetch existing review for this recipe by the current user
        const reviewsResponse = await getRatingsForRecipe(recipeId);
        const currentUserReview = reviewsResponse.data.reviews.find(
          (review) => review.user?._id === userId
        );

        if (currentUserReview) {
          setExistingReview(currentUserReview);
          setReviewData({
            Rating: currentUserReview.Rating,
            Review: currentUserReview.Review || '',
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError('Failed to load recipe or review details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [recipeId, userId]);

  const handleStarClick = (rating) => {
    setReviewData((prevData) => ({ ...prevData, Rating: rating }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    // Prevent submission if it's the user's own recipe
    if (recipe.user?._id === userId) {
      alert("You cannot review your own recipe.");
      return;
    }
  
    if (!reviewData.Rating || reviewData.Rating < 1 || reviewData.Rating > 5) {
      alert('Please provide a valid rating between 1 and 5.');
      return;
    }
  
    const confirmed = window.confirm(
      `Are you sure you want to ${existingReview ? 'update' : 'submit'} this review?\nRating: ${reviewData.Rating}\nReview: ${reviewData.Review}`
    );
  
    if (!confirmed) return;
  
    try {
      if (existingReview) {
        // Update the existing review
        await updateRating(existingReview._id, reviewData);
        alert('Review updated successfully!');
      } else {
        // Add a new review
        await addRating(recipeId, reviewData);
        alert('Review submitted successfully!');
      }
      navigate(`/recipes/${recipeId}/reviews`);
    } catch (err) {
      console.error('Error submitting review:', err.message);
      alert('Failed to submit the review. Please try again.');
    }
  };
  

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return (
    <div className="error-container">
      <h2>{error}</h2>
      <button className="back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );

  return (
    <div className="add-review-container">
      <h2 className="add-review-title">
        {existingReview ? 'Update Review' : 'Add Review'} for "{recipe.Name}"
      </h2>

      <div className="review-form">
        <label htmlFor="Rating" className="star-rating-label">
          <strong>Rating:</strong>
        </label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= reviewData.Rating ? 'filled' : ''}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>

        <label htmlFor="Review" className="review-label">
          <strong>Review:</strong>
        </label>
        <textarea
          id="Review"
          name="Review"
          value={reviewData.Review}
          onChange={handleChange}
          placeholder="Write your review here..."
          className="review-textarea"
        ></textarea>

        <div className="button-container">
          <button className="submit-button" onClick={handleSubmit}>
            {existingReview ? 'Update Review' : 'Submit Review'}
          </button>
          <button className="cancel-button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
