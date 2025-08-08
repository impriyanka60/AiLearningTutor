import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../styles/AppLayout.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
