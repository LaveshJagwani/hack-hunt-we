import { useState, useEffect } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Explore from './pages/Explore';
import Home from './pages/Home';
import './index.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app">
      <div className="site-shell">
        <nav className="navbar">
          <NavLink className="brand" to="/">
            <span className="brand-mark">H</span>
            <span>HackHunt</span>
          </NavLink>

          <div className="nav-links" aria-label="Primary navigation">
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/" end>
              Home
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/calendar">
              Calendar
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/explore">
              Explore
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
