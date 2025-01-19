import React, { useEffect, useState } from 'react';
import { fetchAllUsers, updateUserByAdmin, deleteUserByAdmin } from '../services/api';
import '../App.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [tempAuthorName, setTempAuthorName] = useState('');

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  const loadUsers = async (page) => {
    setLoading(true);
    try {
      const response = await fetchAllUsers(page);
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      alert('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const confirmed = window.confirm('Are you sure you want to change the role for this user?');
    if (!confirmed) return;

    try {
      await updateUserByAdmin(userId, { role: newRole });
      alert('User role updated successfully.');
      loadUsers(page);
    } catch (error) {
      console.error('Error updating user role:', error.message);
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleEditAuthorName = (userId, currentAuthorName) => {
    setEditingUserId(userId);
    setTempAuthorName(currentAuthorName);
  };

  const handleAuthorNameChange = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to change the author name for this user?');
    if (!confirmed) return;

    try {
      await updateUserByAdmin(userId, { AuthorName: tempAuthorName });
      alert('Author name updated successfully.');
      setEditingUserId(null);
      loadUsers(page);
    } catch (error) {
      console.error('Error updating author name:', error.message);
      alert('Failed to update author name. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This will also delete their recipes and reviews. This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteUserByAdmin(userId);
      alert('User and all associated data deleted successfully.');
      loadUsers(page);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="manage-users-container">
      <h2 className="manage-users-title">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Author Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{(page - 1) * 20 + index + 1}</td>
                <td>{user.username || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td className="author-name-cell">
                  {editingUserId === user._id ? (
                    <div className="inline-form">
                      <input
                        type="text"
                        value={tempAuthorName}
                        onChange={(e) => setTempAuthorName(e.target.value)}
                        className="author-name-input"
                      />
                      <button
                        onClick={() => handleAuthorNameChange(user._id)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="inline-display">
                      {user.AuthorName || 'Anonymous'}
                      <button
                        onClick={() => handleEditAuthorName(user._id, user.AuthorName)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  <select
                    value={user.role || 'registered'}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="registered">Registered</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
      <div className="pagination-container">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageUsers;
