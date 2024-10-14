// src/pages/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById, getRatingsForRecipe } from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await getRecipeById(id);
      setRecipe(response.data);
    };
    const fetchRatings = async () => {
      const response = await getRatingsForRecipe(id);
      setRatings(response.data);
    };
    fetchRecipe();
    fetchRatings();
  }, [id]);

  return (
    <div>
      <h2>{recipe.Name}</h2>
      <p>{recipe.Description}</p>
      <h3>Ingredients</h3>
      <p>{recipe.RecipeIngredientParts.join(', ')}</p>
      <h3>Instructions</h3>
      <p>{recipe.RecipeInstructions.join(', ')}</p>
      <h3>Ratings</h3>
      <ul>
        {ratings.map((rating) => (
          <li key={rating._id}>{rating.Review} - {rating.Rating} stars</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
