import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';
import './MyHackathons.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const MyHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Saved Hackathons (those marked savedToCalendar in DB)
        const savedRes = await axios.get(`${API_BASE_URL}/calendar?saved=true`);
        setHackathons(savedRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="my-hackathons-page">
      <header className="page-header">
        <span className="eyebrow">Personal Dashboard</span>
        <h1>Saved Hackathons</h1>
        <p>Keep track of events you have saved from the explore page.</p>
      </header>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading your saved events</span>
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid">
          {hackathons.map((hk) => (
            <HackathonCard key={hk._id} hackathon={hk} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔖</div>
          <h2>No saved hackathons</h2>
          <p>You haven't saved any hackathons yet. Explore and add some to your calendar!</p>
          <a href="/explore" className="primary-link">Explore Hackathons</a>
        </div>
      )}
    </div>
  );
};

export default MyHackathons;
