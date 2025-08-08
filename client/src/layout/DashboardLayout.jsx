import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import '../styles/DashboardLayout.css';
import '../styles/Global.css';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        {/* Top Navigation Bar */}
        <header className="topbar">
          <div>
            <h1>{getGreeting()}, {user?.name || 'Student'}! 👋</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
              Ready to learn something new today?
            </p>
          </div>
          
          <div className="user-actions">
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              Welcome back!
            </span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="content-area">
          <div className="page-container fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
