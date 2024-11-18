// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, deleteUser } from '../services/api';
import '../App.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
        setAuthorName(response.data.AuthorName || '');
      } catch (error) {
        console.error('Failed to load profile:', error);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      // Only sending AuthorName for update
      await updateProfile({ AuthorName: authorName });
      alert('Profile updated successfully');
      setUser((prevUser) => ({ ...prevUser, AuthorName: authorName }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to update profile: ${error.response.data.message}`);
      } else {
        alert('Failed to update profile: An unexpected error occurred');
      }
    }
  };
  
  

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account and all associated recipes?');
    if (!confirmed) return;

    try {
      await deleteUser();
      alert('Account deleted successfully');
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/register');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Author ID:</strong> {user.AuthorId}</p>

        {isEditing ? (
          <>
            <label>Author Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <p><strong>Author Name:</strong> {user.AuthorName || 'N/A'}</p>
        )}
        
        <div className="button-container">
          {!isEditing && <button onClick={() => setIsEditing(true)}>Edit Author Name</button>}
          <button onClick={handleDeleteAccount} className="delete-account-button">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
