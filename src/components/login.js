import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log("Submitting Login:", email, password);

    if (!email || !password) {
      setError("Email and Password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending login request:", { email, password });
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);
      
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Welcome Back</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <label htmlFor="email" className="input-label">Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <label htmlFor="password" className="input-label">Password</label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}