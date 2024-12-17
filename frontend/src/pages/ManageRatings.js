import React, { useEffect, useState } from 'react';
import { getAllRatings, updateRatingByAdmin, deleteRatingByAdmin } from '../services/api';
import '../App.css';

const ManageRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadRatings(page);
  }, [page]);

  const loadRatings = async (page) => {
    setLoading(true);
    try {
      const response = await getAllRatings(page);
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRating = (ratingId, rating) => {
    setEditingRatingId(ratingId);
    setFormData(rating);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (ratingId) => {
    try {
      await updateRatingByAdmin(ratingId, formData);
      alert('Rating updated successfully');
      setEditingRatingId(null);
      loadRatings(page);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDelete = async (ratingId) => {
    const confirmed = window.confirm('Are you sure you want to delete this rating?');
    if (!confirmed) return;

    try {
      await deleteRatingByAdmin(ratingId);
      alert('Rating deleted successfully');
      loadRatings(page);
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  return (
    <div className="ratings-list-container">
      <h2 className="page-title">Manage Reviews</h2>
      {loading ? (
        <p>Loading ratings...</p>
      ) : (
        <div className="ratings-grid">
          {ratings.map((rating, index) => (
            <div key={rating._id} className="rating-card">
              {editingRatingId === rating._id ? (
                <form className="edit-form">
                  <label>
                    Recipe Name:
                    <input
                      type="text"
                      name="recipeName"
                      value={rating.recipe?.Name || 'N/A'}
                      disabled
                    />
                  </label>
                  <label>
                    User Name:
                    <input
                      type="text"
                      name="userName"
                      value={rating.user?.AuthorName || 'N/A'}
                      disabled
                    />
                  </label>
                  <label>
                    Rating:
                    <input
                      type="number"
                      name="Rating"
                      value={formData.Rating || ''}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Review:
                    <textarea
                      name="Review"
                      value={formData.Review || ''}
                      onChange={handleInputChange}
                    ></textarea>
                  </label>
                  <div className="button-group">
                    <button
                      type="button"
                      className="btn-save"
                      onClick={() => handleSave(rating._id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setEditingRatingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>
                    {index + 1}. {rating.recipe?.Name || 'N/A'}
                  </h3>
                  <p>
                    <strong>User:</strong> {rating.user?.AuthorName || 'N/A'}
                  </p>
                  <p>
                    <strong>Rating:</strong> {rating.Rating || '-'}
                  </p>
                  <p>
                    <strong>Review:</strong> {rating.Review || '-'}
                  </p>
                  <div className="button-group">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditRating(rating._id, rating)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
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

export default ManageRatings;