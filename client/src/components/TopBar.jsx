import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/TopBar.css';

const TopBar = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h1 className="app-title">AI Learning Tutor</h1>
        </div>
        <div className="topbar-right">
          <span className="welcome-text">Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
