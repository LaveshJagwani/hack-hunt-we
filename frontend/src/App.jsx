import { useState, useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Host from './pages/Host';
import MyHackathons from './pages/MyHackathons';
import './index.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="app">
      <div className="site-shell">
        {!isLandingPage && (
          <nav className="navbar">
            <NavLink className="brand" to="/">
              <span className="brand-mark">H</span>
              <span>HackHunt</span>
            </NavLink>

            <div className="nav-links" aria-label="Primary navigation">
              <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/home">
                Home
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/calendar">
                Calendar
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/my-hackathons">
                My Hackathons
              </NavLink>
            </div>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="theme-toggle-thumb"></div>
            </button>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/my-hackathons" element={<MyHackathons />} />
          <Route path="/host" element={<Host />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
