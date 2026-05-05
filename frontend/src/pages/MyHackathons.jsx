import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';
import './MyHackathons.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const MyHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyHackathons = async () => {
      try {
        const myIds = JSON.parse(localStorage.getItem('my_hackathons') || '[]');
        if (myIds.length === 0) {
          setHackathons([]);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/hackathons`);
        const allHackathons = response.data.data || [];
        
        // Filter hackathons that are in the user's localStorage list
        const filtered = allHackathons.filter(h => myIds.includes(h._id));
        setHackathons(filtered);
      } catch (error) {
        console.error('Error fetching my hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyHackathons();
  }, []);

  return (
    <div className="my-hackathons-page">
      <header className="page-header">
        <span className="eyebrow">Dashboard</span>
        <h1>My Hackathons</h1>
        <p>Manage and track the hackathons you have posted on the platform.</p>
      </header>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading your events</span>
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid">
          {hackathons.map((hk) => (
            <HackathonCard key={hk._id} hackathon={hk} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h2>No hackathons found</h2>
          <p>You haven't posted any hackathons yet. Start by hosting your first event!</p>
          <a href="/host" className="primary-link">Host a Hackathon</a>
        </div>
      )}
    </div>
  );
};

export default MyHackathons;
