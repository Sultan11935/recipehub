import React, { useEffect, useState } from 'react';
import { getRecipeCategoryReport } from '../services/api';
import '../App.css';

const CategoryReport = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryReport = async () => {
      try {
        const response = await getRecipeCategoryReport();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching category report:', err.message);
        setError('Failed to load category report.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryReport();
  }, []);

  return (
    <div className="reports-container">
      <h2>Recipe Categories Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Number of Recipes</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id || 'Uncategorized'}</td>
                <td>{category.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryReport;
