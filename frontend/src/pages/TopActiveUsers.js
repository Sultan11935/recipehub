import React, { useEffect, useState } from 'react';
import { fetchTopActiveUsers } from '../services/api';
import '../App.css';

const TopActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTopActiveUsers();
        setUsers(response.data || []); // Default to an empty array if no data
      } catch (err) {
        console.error('Error fetching active users:', err.message);
        setError('Failed to load active users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> {/* Replace with a spinner or loading indicator */}
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!users.length) {
    return <p className="no-data-message">No active users found.</p>;
  }

  return (
    <div className="active-users-container">
      <h2 className="active-users-title">Top 10 Active Users</h2>

      <div className="user-card-container">
        {users.map((user, index) => (
          <div key={user._id || index} className="user-card">
            <h3>
              {index + 1}. {user.username || 'Anonymous'} {/* Fallback for missing AuthorName */}
            </h3>
            <p>
              <span>Number of Reviews:</span> {user.reviewCount || 0} {/* Fallback for missing reviewCount */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopActiveUsers;
