import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById } from '../services/api';
import '../App.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await getRecipeById(id);
        setRecipe(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipe details.');
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-card">
        <h2 className="recipe-detail-title">Recipe Details</h2>
        <h3 className="recipe-name">{recipe.Name}</h3>

        <div className="recipe-info-section">
          <h4 className="section-title">Recipe Information</h4>
          <div className="recipe-info-grid">
            {/* Column 1 */}
            <div className="recipe-info-column">
              <p><strong>Description:</strong> {recipe.Description || '-'}</p>
              <p><strong>Calories:</strong> {recipe.Calories || '-'}</p>
              <p><strong>Fat Content:</strong> {recipe.FatContent || '-'}</p>
              <p><strong>Saturated Fat:</strong> {recipe.SaturatedFatContent || '-'}</p>
              <p><strong>Cholesterol:</strong> {recipe.CholesterolContent || '-'}</p>
              <p><strong>Sodium:</strong> {recipe.SodiumContent || '-'}</p>
              <p><strong>Carbohydrates:</strong> {recipe.CarbohydrateContent || '-'}</p>
              <p><strong>Fiber:</strong> {recipe.FiberContent || '-'}</p>
              <p><strong>Sugar:</strong> {recipe.SugarContent || '-'}</p>
              <p><strong>Protein:</strong> {recipe.ProteinContent || '-'}</p>
            </div>

            {/* Column 2 */}
            <div className="recipe-info-column">
              <p><strong>Servings:</strong> {recipe.RecipeServings || '-'}</p>
              <p><strong>Yield:</strong> {recipe.RecipeYield || '-'}</p>
              <p><strong>Cook Time:</strong> {recipe.CookTime || '-'}</p>
              <p><strong>Prep Time:</strong> {recipe.PrepTime || '-'}</p>
              <p><strong>Total Time:</strong> {recipe.TotalTime || '-'}</p>
              <p><strong>Category:</strong> {recipe.RecipeCategory || '-'}</p>
              <p><strong>Keywords:</strong> {recipe.Keywords || '-'}</p>
              <p><strong>Ingredients:</strong> {recipe.RecipeIngredientParts || '-'}</p>
              <p><strong>Quantities:</strong> {recipe.RecipeIngredientQuantities || '-'}</p>
              <p><strong>Instructions:</strong> {recipe.RecipeInstructions || '-'}</p>
            </div>
          </div>
        </div>

        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
