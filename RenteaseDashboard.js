import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/RenteaseDashboard.css';
import { FaHome, FaBuilding, FaUser, FaMoneyBill, FaTools, FaFileContract, FaBars, FaSun, FaMoon } from 'react-icons/fa';

const RenteaseDashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  const navItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/' },
    { name: 'Properties', icon: <FaBuilding />, path: '/properties' },
    { name: 'Tenants', icon: <FaUser />, path: '/tenants' },
    { name: 'Rent Payments', icon: <FaMoneyBill />, path: '/rent-payments' },
    { name: 'Maintenance Requests', icon: <FaTools />, path: '/maintenance' },
    { name: 'Lease Agreements', icon: <FaFileContract />, path: '/lease' },
  ];

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="logo">
          <span className="logo-main">RentEase</span>
          {sidebarOpen && <span className="logo-sub">Property Management</span>}
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="icon">{item.icon}</div>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Layout */}
      <main className="main">
        <div className="topbar">
          <button className="icon-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <button className="icon-btn" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default RenteaseDashboard;
