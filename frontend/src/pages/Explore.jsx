import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const platforms = ['Devfolio', 'Unstop', 'Hack2Skill', 'Devpost', 'MLH', 'HackerEarth'];
const modes = ['online', 'offline', 'hybrid'];
const dateFilters = [
  { label: 'All Dates', value: '' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Saved', value: 'saved' },
  { label: 'No Date', value: 'no-date' },
  { label: 'Closed', value: 'closed' },
];
const sortOptions = [
  { label: 'Newest Added', value: 'newest' },
  { label: 'Deadline Soon', value: 'deadline' },
  { label: 'Title A-Z', value: 'title' },
  { label: 'Platform A-Z', value: 'platform' },
];

function getDeadlineTime(hackathon) {
  const raw = hackathon.parsedDeadline || hackathon.deadline;
  if (!raw || raw === 'Unknown') return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

const Explore = () => {
  const [hackathons, setHackathons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [nowTime, setNowTime] = useState(0);

  const updateList = (response) => {
    const data = response.data.data || [];
    setHackathons(data);
    setTotalCount(response.data.count || data.length);
  };

  const fetchHackathons = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/hackathons`);
      updateList(response);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setNowTime(Date.now());
        const response = await axios.get(`${API_BASE_URL}/hackathons`);
        updateList(response);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchQuery(searchQuery.trim());
  };

  const onPlatformChange = (e) => {
    setFilterPlatform(e.target.value);
  };

  const onModeChange = (e) => {
    setFilterMode(e.target.value);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMessage('Scraping the latest hackathons...');
    try {
      const refreshResponse = await axios.post(`${API_BASE_URL}/refresh`);
      await fetchHackathons();
      setNowTime(Date.now());
      const result = refreshResponse.data.result;
      setSearchQuery('');
      setFilterPlatform('');
      setFilterMode('');
      setFilterDate('');
      setSortBy('newest');
      setRefreshMessage(
        result
          ? `Refresh complete: ${result.upserted} saved from ${result.found} found.`
          : 'Refresh complete.'
      );
    } catch (error) {
      console.error('Error refreshing hackathons:', error);
      setRefreshMessage('Refresh failed. Check backend logs and try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCalendarSaved = (id) => {
    setHackathons((items) => (
      items.map((item) => (
        item._id === id ? { ...item, savedToCalendar: true } : item
      ))
    ));
  };

  const visibleHackathons = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const now = nowTime;

    return hackathons
      .filter((hackathon) => {
        const deadlineTime = getDeadlineTime(hackathon);
        const matchesSearch = !query
          || hackathon.title?.toLowerCase().includes(query)
          || hackathon.platform?.toLowerCase().includes(query)
          || hackathon.tags?.some((tag) => tag.toLowerCase().includes(query));
        const matchesPlatform = !filterPlatform || hackathon.platform === filterPlatform;
        const matchesMode = !filterMode || hackathon.mode?.toLowerCase() === filterMode;
        const matchesDate = !filterDate
          || (filterDate === 'upcoming' && deadlineTime && deadlineTime >= now)
          || (filterDate === 'saved' && hackathon.savedToCalendar)
          || (filterDate === 'no-date' && !deadlineTime)
          || (filterDate === 'closed' && deadlineTime && deadlineTime < now);

        return matchesSearch && matchesPlatform && matchesMode && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return (getDeadlineTime(a) || Number.MAX_SAFE_INTEGER) - (getDeadlineTime(b) || Number.MAX_SAFE_INTEGER);
        }
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'platform') {
          return (a.platform || '').localeCompare(b.platform || '') || (a.title || '').localeCompare(b.title || '');
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [filterDate, filterMode, filterPlatform, hackathons, nowTime, searchQuery, sortBy]);

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Browse</span>
        <h1>Explore hackathons</h1>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Feed</span>
            <h2>All hackathons</h2>
          </div>
          <div className="feed-actions">
            <button className="refresh-btn" type="button" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="result-count">{visibleHackathons.length} of {totalCount} results</div>
          </div>
        </div>

        {refreshMessage && (
          <div className={refreshing ? 'refresh-status active' : 'refresh-status'}>
            {refreshMessage}
          </div>
        )}

        <div className="explore-toolbar">
          <form onSubmit={handleSearch} className="hero-search explore-search">
            <input
              type="text"
              placeholder="Search by title or tag"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="filters">
            <select value={filterPlatform} onChange={onPlatformChange} aria-label="Filter by platform">
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option value={platform} key={platform}>{platform}</option>
              ))}
            </select>

            <select value={filterMode} onChange={onModeChange} aria-label="Filter by mode">
              <option value="">All Modes</option>
              {modes.map((mode) => (
                <option value={mode} key={mode}>{mode[0].toUpperCase() + mode.slice(1)}</option>
              ))}
            </select>

            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} aria-label="Filter by date status">
              {dateFilters.map((filter) => (
                <option value={filter.value} key={filter.value}>{filter.label}</option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort hackathons">
              {sortOptions.map((option) => (
                <option value={option.value} key={option.value}>Sort: {option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : visibleHackathons.length > 0 ? (
          <div className="grid">
            {visibleHackathons.map((hk) => (
              <HackathonCard key={hk._id} hackathon={hk} onCalendarSaved={handleCalendarSaved} />
            ))}
          </div>
        ) : (
          <EmptyState title="No hackathons found" subtitle="Try changing your search or filters." />
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

export default Explore;
