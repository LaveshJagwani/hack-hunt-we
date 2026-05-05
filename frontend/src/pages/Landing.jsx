import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <div className="landing-brand">
            <span className="brand-mark">H</span>
            <h1>HackHunt</h1>
          </div>
          <p className="landing-tagline">The ultimate hub for hackathon enthusiasts and organizers.</p>
        </header>

        <main className="landing-grid">
          <Link to="/home" className="landing-card search-card">
            <div className="card-content">
              <span className="card-icon">🔍</span>
              <h2>Look for Hackathons</h2>
              <p>Discover top-tier hackathons across multiple platforms with real-time updates and deadlines.</p>
              <span className="card-cta">Start Hunting →</span>
            </div>
          </Link>

          <Link to="/host" className="landing-card post-card">
            <div className="card-content">
              <span className="card-icon">➕</span>
              <h2>Host your Hackathon</h2>
              <p>Promote your event to a global community of developers and builders.</p>
              <span className="card-cta">Post Now →</span>
            </div>
          </Link>
        </main>

        <footer className="landing-footer">
          <p>&copy; 2024 HackHunt. Built for the builder community.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
