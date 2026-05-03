import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/hackathons`);
      const data = response.data.data || [];
      setHackathons(data);
      setTotalCount(response.data.count || data.length);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return fetchHackathons();
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      const data = response.data.data || [];
      setHackathons(data);
      setTotalCount(response.data.count || data.length);
      setFilterPlatform('');
      setFilterMode('');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (platform, mode) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (platform) params.append('platform', platform);
      if (mode) params.append('mode', mode);

      const response = await axios.get(`${API_BASE_URL}/filter?${params.toString()}`);
      const data = response.data.data || [];
      setHackathons(data);
      setTotalCount(response.data.count || data.length);
    } catch (error) {
      console.error('Error filtering:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPlatformChange = (e) => {
    const val = e.target.value;
    setFilterPlatform(val);
    setSearchQuery('');
    handleFilter(val, filterMode);
  };

  const onModeChange = (e) => {
    const val = e.target.value;
    setFilterMode(val);
    setSearchQuery('');
    handleFilter(filterPlatform, val);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>HackHunt</h1>
        <p>Find hackathons from multiple platforms in one place.</p>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{totalCount}</span> hackathons found
          </div>
        </div>
      </header>

      <div className="controls-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search hackathons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filters">
          <select value={filterPlatform} onChange={onPlatformChange}>
            <option value="">All Platforms</option>
            <option value="Devfolio">Devfolio</option>
            <option value="Unstop">Unstop</option>
            <option value="Hack2Skill">Hack2Skill</option>
            <option value="Devpost">Devpost</option>
            <option value="MLH">MLH</option>
            <option value="HackerEarth">HackerEarth</option>
          </select>

          <select value={filterMode} onChange={onModeChange}>
            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <main className="content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading...</span>
          </div>
        ) : hackathons.length > 0 ? (
          <div className="grid">
            {hackathons.map(hk => (
              <HackathonCard key={hk._id} hackathon={hk} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <div className="no-results-title">No hackathons found</div>
            <div className="no-results-subtitle">Try changing your search or filters.</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
