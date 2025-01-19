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
        setLoading(true);
        const response = await getRecipeCategoryReport();
        setCategories(response.data || []);
        setError(null); // Reset error state on successful fetch
      } catch (err) {
        console.error('Error fetching category report:', err.message);
        setError('Failed to load category report. Please try again later.');
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
        <p>Loading category report...</p>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Number of Recipes</th>
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
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default CategoryReport;
