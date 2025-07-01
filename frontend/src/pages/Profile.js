import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subscription: user?.subscription || 'basic'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // In a real app, you would make an API call here
      // For now, we'll just show a success message
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subscription">Subscription Plan</label>
                <select
                  id="subscription"
                  name="subscription"
                  value={formData.subscription}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          <div className="subscription-info">
            <h3>Subscription Benefits</h3>
            <div className="subscription-plans">
              <div className="plan">
                <h4>Basic</h4>
                <ul>
                  <li>Watch on 1 device</li>
                  <li>Good video quality</li>
                  <li>Mobile and tablet access</li>
                </ul>
              </div>
              <div className="plan">
                <h4>Standard</h4>
                <ul>
                  <li>Watch on 2 devices</li>
                  <li>HD video quality</li>
                  <li>All device access</li>
                </ul>
              </div>
              <div className="plan">
                <h4>Premium</h4>
                <ul>
                  <li>Watch on 4 devices</li>
                  <li>4K + HDR video quality</li>
                  <li>All device access</li>
                  <li>Premium content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;