@@ .. @@
 import React, { useState } from 'react';
 import { Link, useLocation } from 'react-router-dom';
-import '../styles/RenteaseDashboard.css';
-import { FaHome, FaBuilding, FaUser, FaMoneyBill, FaTools, FaFileContract, FaBars, FaSun, FaMoon } from 'react-icons/fa';
+import { FaHome, FaBuilding, FaUser, FaMoneyBill, FaTools, FaFileContract, FaBars, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
+import { useAuth } from '../context/AuthContext';
 
 const RenteaseDashboard = ({ children }) => {
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const [darkMode, setDarkMode] = useState(false);
   const location = useLocation();
+  const { user, logout } = useAuth();
 
   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
   const toggleTheme = () => setDarkMode(!darkMode);
+  const handleLogout = () => {
+    logout();
+  };
 
   const navItems = [
-    { name: 'Dashboard', icon: <FaHome />, path: '/' },
+    { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
     { name: 'Properties', icon: <FaBuilding />, path: '/properties' },
     { name: 'Tenants', icon: <FaUser />, path: '/tenants' },
     { name: 'Rent Payments', icon: <FaMoneyBill />, path: '/rent-payments' },
@@ -2,7 +8,7 @@
   ];
 
   return (
-    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
+    <div className={`min-h-screen flex transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
       {/* Sidebar */}
-      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
-        <div className="logo">
-          <span className="logo-main">RentEase</span>
-          {sidebarOpen && <span className="logo-sub">Property Management</span>}
+      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 flex flex-col`}>
+        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
+          <div className="flex items-center space-x-3">
+            <FaBuilding className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
+            {sidebarOpen && (
+              <div>
+                <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>RentEase</div>
+                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Property Management</div>
+              </div>
+            )}
+          </div>
         </div>
-        <nav className="nav">
+        
+        <nav className="flex-1 p-4 space-y-2">
           {navItems.map((item) => (
             <Link 
               key={item.name}
               to={item.path}
-              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
+              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
+                location.pathname === item.path
+                  ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
+                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`
+              } ${!sidebarOpen ? 'justify-center' : ''}`}
             >
-              <div className="icon">{item.icon}</div>
+              <div className="text-xl">{item.icon}</div>
               {sidebarOpen && <span>{item.name}</span>}
             </Link>
           ))}
         </nav>
+        
+        {/* User Info & Logout */}
+        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
+          {sidebarOpen && (
+            <div className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
+              <div className="text-sm font-medium">{user?.username}</div>
+              <div className="text-xs text-gray-500">{user?.email}</div>
+            </div>
+          )}
+          <button
+            onClick={handleLogout}
+            className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 w-full ${
+              darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
+            } ${!sidebarOpen ? 'justify-center' : ''}`}
+          >
+            <FaSignOutAlt className="text-lg" />
+            {sidebarOpen && <span>Logout</span>}
+          </button>
+        </div>
       </aside>
 
       {/* Main Layout */}
-      <main className="main">
-        <div className="topbar">
+      <main className="flex-1 flex flex-col">
+        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
+          <div className="flex justify-between items-center">
+            <button
+              onClick={toggleSidebar}
+              className={`p-2 rounded-lg transition-colors duration-200 ${
+                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
+              }`}
+            >
+              <FaBars className="w-5 h-5" />
+            </button>
+            <button
+              onClick={toggleTheme}
+              className={`p-2 rounded-lg transition-colors duration-200 ${
+                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
+              }`}
+            >
+              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
+            </button>
+          </div>
+        </div>
+        
+        <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
+          {children}
+        </div>
+      </main>
+    </div>
+  );
+};
+
+export default RenteaseDashboard;
+