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
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to access your profile.');
        navigate('/login');
        return;
      }

      try {
        const response = await getProfile();
        setUser(response.data);
        setAuthorName(response.data.AuthorName || '');
      } catch (error) {
        console.error('Failed to load profile:', error);
        alert('Session expired or unauthorized access. Please log in again.');
        localStorage.clear(); // Clear all localStorage items
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!authorName.trim()) {
      alert('Author Name cannot be empty.');
      return;
    }

    try {
      await updateProfile({ AuthorName: authorName });
      alert('Profile updated successfully. Associated recipes will reflect the updated author name.');
      setUser((prevUser) => ({ ...prevUser, AuthorName: authorName }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account and all associated recipes? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteUser();
      alert('Account and all associated recipes deleted successfully.');
      localStorage.clear(); // Clear all localStorage items
      navigate('/register');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Username:</strong> {user.username || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Author ID:</strong> {user.AuthorId || 'N/A'}</p>
        </div>

        {isEditing ? (
          <div className="profile-edit-form">
            <label className="profile-label">Author Name:</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="profile-input"
              placeholder="Enter your author name"
            />
            <div className="profile-actions">
              <button onClick={handleUpdate} className="save-button">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p><strong>Author Name:</strong> {user.AuthorName || 'N/A'}</p>
        )}

        <div className="profile-actions">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Author Name
            </button>
          )}
          <button onClick={handleDeleteAccount} className="delete-account-button">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
