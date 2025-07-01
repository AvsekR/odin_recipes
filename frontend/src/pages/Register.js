import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Sign Up</h1>
            
            {(error || localError) && (
              <div className="error-message">
                {error || localError}
              </div>
            )}
            
            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={name}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
              
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
              
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
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
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <div className="auth-links">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;