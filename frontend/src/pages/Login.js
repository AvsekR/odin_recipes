import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Sign In</h1>
            
            {(error || localError) && (
              <div className="error-message">
                {error || localError}
              </div>
            )}
            
            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-links">
              <p>
                New to Netflix?{' '}
                <Link to="/register" className="auth-link">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;