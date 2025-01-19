import React, { useEffect, useState } from 'react';
import { getReportsData } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ViewReports = () => {
  const [reportsData, setReportsData] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getReportsData();
        setReportsData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching reports data:', error);
        setError('Failed to fetch reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="reports-container">
      <h2 className="reports-title">Admin Reports</h2>
      {loading ? (
        <div className="loading-container">
          <p>Loading reports...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : (
        <div className="reports-stats">
          <div className="report-card">
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{reportsData.totalUsers}</p>
          </div>
          <div className="report-card">
            <h3 className="card-title">Total Recipes</h3>
            <p className="card-value">{reportsData.totalRecipes}</p>
          </div>
          <div className="report-card">
            <h3 className="card-title">Total Ratings</h3>
            <p className="card-value">{reportsData.totalRatings}</p>
          </div>

          {/* Recipe Categories Report Card */}
          <div
            className="report-card clickable category-report-card"
            onClick={() => navigate('/reports/categories')}
          >
            <h3 className="card-title">Recipe Categories Report</h3>
            <p className="card-description">
              Explore recipe categories and their respective counts.
            </p>
            <button className="report-button">View Category Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReports;
