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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReportsData();
        setReportsData(response.data);
      } catch (error) {
        console.error('Error fetching reports data:', error);
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
        <p>Loading...</p>
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

          {/* New Card to Navigate to Category Report */}
          <div
            className="report-card clickable category-report-card"
            onClick={() => navigate('/reports/categories')}
          >
            <h3 className="card-title">Recipe Categories Report</h3>
            <button className="report-button">View Category Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReports;
