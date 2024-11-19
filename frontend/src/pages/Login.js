// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      console.log('Full login response:', response); // Inspect the full response

      // Access token and role from the response
      const token = response.token;
      const role = response.role;

      if (token && role) {
        // Save token and role to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        console.log('Token after setting:', localStorage.getItem('token'));
        console.log('Role after setting:', localStorage.getItem('role'));

        // Role-based redirection
        if (role === 'admin') {
          navigate('/admin'); // Redirect to Admin Landing Page
        } else {
          navigate('/home'); // Redirect to User Home Page
        }
      } else {
        alert('Login failed: Token or role missing in response.');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
