import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [topHackathons, setTopHackathons] = useState([]);
  const [insights, setInsights] = useState({
    total: 0,
    platforms: 0,
    online: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const [hackathonsResponse, topResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/hackathons`),
          axios.get(`${API_BASE_URL}/top?limit=6`),
        ]);

        const data = hackathonsResponse.data.data || [];
        setInsights(hackathonsResponse.data.insights || {
          total: data.length,
          platforms: 0,
          online: 0,
          upcoming: 0,
        });
        setTopHackathons(topResponse.data.data || data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Multi-platform hackathon finder</div>
          <h1>Find the next build sprint worth your weekend.</h1>
          <p>
            Discover top hackathons from Devfolio, Unstop, Hack2Skill, Devpost,
            MLH, and HackerEarth with deadlines, modes, and quick application links.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/explore">Explore hackathons</Link>
            <Link className="secondary-link" to="/calendar">Open calendar</Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Hackathon summary">
          <div className="panel-header">
            <span>Live index</span>
            <strong>{insights.total}</strong>
          </div>
          <div className="metric-grid">
            <div className="metric">
              <span>{insights.platforms}</span>
              <p>Platforms</p>
            </div>
            <div className="metric">
              <span>{insights.upcoming}</span>
              <p>Dated deadlines</p>
            </div>
            <div className="metric">
              <span>{insights.online}</span>
              <p>Online</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Top picks</span>
            <h2>Top hackathons</h2>
          </div>
          <Link className="text-button" to="/explore">View all</Link>
        </div>

        {loading ? (
          <LoadingState />
        ) : topHackathons.length > 0 ? (
          <div className="featured-grid">
            {topHackathons.map((hk) => (
              <HackathonCard key={hk._id} hackathon={hk} featured />
            ))}
          </div>
        ) : (
          <EmptyState title="No top hackathons yet" subtitle="Run the scraper or add hackathon data to populate this page." />
        )}
      </section>
    </main>
  );
};

const LoadingState = () => (
  <div className="loading">
    <div className="loading-spinner"></div>
    <span className="loading-text">Loading hackathons</span>
  </div>
);

const EmptyState = ({ title, subtitle }) => (
  <div className="no-results">
    <div className="no-results-title">{title}</div>
    <div className="no-results-subtitle">{subtitle}</div>
  </div>
);

export default Home;
