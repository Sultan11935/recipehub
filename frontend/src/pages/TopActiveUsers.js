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
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching active users:', err.message);
        setError('Failed to load active users.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="active-users-container">
      <h2 className="active-users-title">Top 10 Active Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="user-card-container">
          {users.map((user, index) => (
            <div key={user._id} className="user-card">
              <h3>
                {index + 1}. {user.AuthorName}
              </h3>
              <p>
                <span>Number of Reviews:</span> {user.reviewCount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopActiveUsers;
