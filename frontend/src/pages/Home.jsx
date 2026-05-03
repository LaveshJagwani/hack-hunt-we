import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';

const API_BASE_URL = 'http://localhost:5000/api';

const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/hackathons`);
      setHackathons(response.data);
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
      const response = await axios.get(`${API_BASE_URL}/search?q=${searchQuery}`);
      setHackathons(response.data);
      // Reset filters since search overrides
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
      let queryUrl = `${API_BASE_URL}/filter?`;
      if (platform) queryUrl += `platform=${platform}&`;
      if (mode) queryUrl += `mode=${mode}`;
      
      const response = await axios.get(queryUrl);
      setHackathons(response.data);
    } catch (error) {
      console.error('Error filtering:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPlatformChange = (e) => {
    const val = e.target.value;
    setFilterPlatform(val);
    handleFilter(val, filterMode);
  };

  const onModeChange = (e) => {
    const val = e.target.value;
    setFilterMode(val);
    handleFilter(filterPlatform, val);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>HackHunt</h1>
        <p>Find your next hackathon.</p>
      </header>

      <div className="controls-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            placeholder="Search by title or tag..." 
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
          <div className="loading">Loading hackathons...</div>
        ) : hackathons.length > 0 ? (
          <div className="grid">
            {hackathons.map(hk => (
              <HackathonCard key={hk._id} hackathon={hk} />
            ))}
          </div>
        ) : (
          <div className="no-results">No hackathons found matching your criteria.</div>
        )}
      </main>
    </div>
  );
};

export default Home;