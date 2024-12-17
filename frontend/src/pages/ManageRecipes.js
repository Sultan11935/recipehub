import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAllRecipes,
  updateRecipeByAdmin,
  deleteRecipeByAdmin,
} from '../services/api';
import '../App.css';

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the recipe being edited
  const [formData, setFormData] = useState({}); // Holds the data for the recipe being edited

  useEffect(() => {
    loadRecipes(page);
  }, [page]);

  const loadRecipes = async (page) => {
    setLoading(true);
    try {
      const response = await fetchAllRecipes(page);
      setRecipes(response.data.recipes || []);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipes:', err.response ? err.response.data : err.message);
      setLoading(false);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setFormData(recipes[index]); // Populate formData with the recipe data for editing
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await updateRecipeByAdmin(id, formData);
      const updatedRecipes = recipes.map((recipe) =>
        recipe._id === id ? { ...recipe, ...formData } : recipe
      );
      setRecipes(updatedRecipes);
      setEditIndex(null); // Exit edit mode
      alert('Recipe updated successfully');
    } catch (err) {
      console.error('Error updating recipe:', err.response ? err.response.data : err.message);
      alert('Update failed');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmed) return;

    try {
      await deleteRecipeByAdmin(id);
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
      alert('Recipe deleted successfully');
    } catch (err) {
      console.error('Failed to delete recipe:', err.response ? err.response.data : err.message);
      alert('Failed to delete recipe');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="add-recipe-container">
      <h2 className="recipe-list-title">Manage Recipes</h2>
      <Link to="/add-recipe" className="add-recipe-button">
        Add New Recipe
      </Link>

      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="recipe-card">
              <h3 className="recipe-title">
                {(page - 1) * 20 + (index + 1)}. {recipe.Name} (ID: {recipe.RecipeId || 'Not Available'})
              </h3>

              <p>
                <strong>Author Name:</strong> {recipe.user?.AuthorName || 'N/A'}
              </p>
              <p>
                <strong>Author ID:</strong> {recipe.user?.AuthorId || 'N/A'}
              </p>
              <p>
                <strong>Aggregated Rating:</strong> {recipe.AggregatedRating || 'N/A'}
              </p>
              <p>
                <strong>Review Count:</strong> {recipe.ReviewCount || 'N/A'}
              </p>
              {editIndex === index ? (
                <div className="recipe-detail-form">
                  <div className="details-grid">
                    <label>Name</label>
                    <input type="text" name="Name" value={formData.Name || ''} onChange={handleChange} />

                    <label>Cook Time</label>
                    <input type="text" name="CookTime" value={formData.CookTime || ''} onChange={handleChange} />

                    <label>Prep Time</label>
                    <input type="text" name="PrepTime" value={formData.PrepTime || ''} onChange={handleChange} />

                    <label>Total Time</label>
                    <input type="text" name="TotalTime" value={formData.TotalTime || ''} onChange={handleChange} />

                    <label>Description</label>
                    <textarea name="Description" value={formData.Description || ''} onChange={handleChange}></textarea>

                    <label>Calories</label>
                    <input type="number" name="Calories" value={formData.Calories || ''} onChange={handleChange} />

                    <label>Fat Content</label>
                    <input type="number" name="FatContent" value={formData.FatContent || ''} onChange={handleChange} />

                    <label>Saturated Fat Content</label>
                    <input type="number" name="SaturatedFatContent" value={formData.SaturatedFatContent || ''} onChange={handleChange} />

                    <label>Cholesterol Content</label>
                    <input type="number" name="CholesterolContent" value={formData.CholesterolContent || ''} onChange={handleChange} />

                    <label>Sodium Content</label>
                    <input type="number" name="SodiumContent" value={formData.SodiumContent || ''} onChange={handleChange} />

                    <label>Carbohydrate Content</label>
                    <input type="number" name="CarbohydrateContent" value={formData.CarbohydrateContent || ''} onChange={handleChange} />

                    <label>Fiber Content</label>
                    <input type="number" name="FiberContent" value={formData.FiberContent || ''} onChange={handleChange} />

                    <label>Sugar Content</label>
                    <input type="number" name="SugarContent" value={formData.SugarContent || ''} onChange={handleChange} />

                    <label>Protein Content</label>
                    <input type="number" name="ProteinContent" value={formData.ProteinContent || ''} onChange={handleChange} />

                    <label>Recipe Servings</label>
                    <input type="number" name="RecipeServings" value={formData.RecipeServings || ''} onChange={handleChange} />

                    <label>Recipe Yield</label>
                    <input type="text" name="RecipeYield" value={formData.RecipeYield || ''} onChange={handleChange} />

                    <label>Category</label>
                    <input type="text" name="RecipeCategory" value={formData.RecipeCategory || ''} onChange={handleChange} />

                    <label>Keywords</label>
                    <input type="text" name="Keywords" value={formData.Keywords || ''} onChange={handleChange} />

                    <label>Ingredient Quantities</label>
                    <input
                      type="text"
                      name="RecipeIngredientQuantities"
                      value={formData.RecipeIngredientQuantities || ''}
                      onChange={handleChange}
                    />

                    <label>Ingredient Parts</label>
                    <textarea
                      name="RecipeIngredientParts"
                      value={formData.RecipeIngredientParts || ''}
                      onChange={handleChange}
                    ></textarea>

                    <label>Instructions</label>
                    <textarea
                      name="RecipeInstructions"
                      value={formData.RecipeInstructions || ''}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="recipe-actions">
                    <button onClick={() => handleSave(recipe._id)} className="save-button">
                      Save
                    </button>
                    <button onClick={() => setEditIndex(null)} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="recipe-actions">
                  <button className="edit-button" onClick={() => handleEditClick(index)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(recipe._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes available.</p>
      )}
      <div className="pagination-container">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="pagination-button">
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageRecipes;
