import React, { useState } from 'react';
import axios from 'axios';
import './Host.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Host = () => {
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    mode: 'online',
    deadline: '',
    link: '',
    tags: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t !== ''),
      };

      const response = await axios.post(`${API_BASE_URL}/hackathons`, payload);
      
      // Save ID to localStorage to track user-submitted hackathons
      const myHackathons = JSON.parse(localStorage.getItem('my_hackathons') || '[]');
      myHackathons.push(response.data.data._id);
      localStorage.setItem('my_hackathons', JSON.stringify(myHackathons));

      setStatus({ type: 'success', message: response.data.message });
      setFormData({
        title: '',
        platform: '',
        mode: 'online',
        deadline: '',
        link: '',
        tags: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to post hackathon. Please try again.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="host-page">
      <div className="host-container">
        <header className="host-header">
          <span className="eyebrow">Organizers</span>
          <h1>Host your Hackathon</h1>
          <p>Reach thousands of developers by listing your event on HackHunt.</p>
        </header>

        <form className="host-form" onSubmit={handleSubmit}>
          {status.message && (
            <div className={`status-banner ${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Hackathon Name</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Global AI Summit"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="platform">Hosting Platform</label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                placeholder="e.g. Devfolio, Own Website"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mode">Event Mode</label>
              <select id="mode" name="mode" value={formData.mode} onChange={handleChange}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Registration Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="link">Registration Link (URL)</label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://your-hackathon.com/register"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="tags">Tags (Comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="AI, Web3, Beginner Friendly"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post Hackathon'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Host;
