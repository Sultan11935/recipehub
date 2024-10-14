// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(token);
        setUser(response.data);
      } catch (error) {
        alert('Failed to load profile.');
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
