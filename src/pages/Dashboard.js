@@ .. @@
 import React from 'react';
-import { FaBuilding, FaUser, FaMoneyBill } from 'react-icons/fa';
-import '../styles/RenteaseDashboard.css';
+import { useState, useEffect } from 'react';
+import { FaBuilding, FaUser, FaMoneyBill, FaPlus, FaTools } from 'react-icons/fa';
+import { Link } from 'react-router-dom';
+import { propertiesAPI, tenantsAPI, rentPaymentsAPI, maintenanceAPI } from '../utils/api';
 
-export default function DashboardPage() {
+export default function Dashboard() {
+  const [stats, setStats] = useState({
+    totalProperties: 0,
+    activeTenants: 0,
+    pendingPayments: 0,
+    openRequests: 0
+  });
+  const [recentRequests, setRecentRequests] = useState([]);
+  const [loading, setLoading] = useState(true);
+
+  useEffect(() => {
+    fetchDashboardData();
+  }, []);
+
+  const fetchDashboardData = async () => {
+    try {
+      const [properties, tenants, payments, maintenance] = await Promise.all([
+        propertiesAPI.getAll(),
+        tenantsAPI.getAll(),
+        rentPaymentsAPI.getAll(),
+        maintenanceAPI.getAll()
+      ]);
+
+      setStats({
+        totalProperties: properties.length,
+        activeTenants: tenants.filter(t => t.status === 'active').length,
+        pendingPayments: payments.filter(p => p.status === 'pending').length,
+        openRequests: maintenance.filter(m => m.status === 'open').length
+      });
+
+      setRecentRequests(maintenance.slice(0, 5));
+    } catch (error) {
+      console.error('Error fetching dashboard data:', error);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const getStatusBadge = (status) => {
+    const statusClasses = {
+      open: 'bg-red-100 text-red-800',
+      in_progress: 'bg-blue-100 text-blue-800',
+      resolved: 'bg-green-100 text-green-800'
+    };
+    
+    return (
+      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
+        {status.replace('_', ' ').toUpperCase()}
+      </span>
+    );
+  };
+
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-64">
+        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
+      </div>
+    );
+  }
+
   return (
-    <div>
-      <h1 className="main-title">Welcome back, John!</h1>
-      <p className="subtitle">Here's what's happening with your properties today.</p>
+    <div className="space-y-6">
+      <div>
+        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
+        <p className="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
+      </div>
 
-      {/* Summary Cards */}
-      <div className="cards">
-        <div className="card">
-          <h2>Total Properties</h2>
-          <p>24</p>
-          <div className="card-icon blue"><FaBuilding /></div>
+      {/* Quick Actions */}
+      <div className="flex flex-wrap gap-3">
+        <Link
+          to="/properties"
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Property</span>
+        </Link>
+        <Link
+          to="/tenants"
+          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Tenant</span>
+        </Link>
+      </div>
+
+      {/* Summary Cards */}
+      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
+        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
+          <div className="flex items-center justify-between">
+            <div>
+              <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
+              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProperties}</p>
+            </div>
+            <div className="bg-blue-100 p-3 rounded-xl">
+              <FaBuilding className="w-6 h-6 text-blue-600" />
+            </div>
+          </div>
         </div>
-        <div className="card">
-          <h2>Active Tenants</h2>
-          <p>18</p>
-          <div className="card-icon green"><FaUser /></div>
+        
+        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
+          <div className="flex items-center justify-between">
+            <div>
+              <h3 className="text-sm font-medium text-gray-500">Active Tenants</h3>
+              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeTenants}</p>
+            </div>
+            <div className="bg-green-100 p-3 rounded-xl">
+              <FaUser className="w-6 h-6 text-green-600" />
+            </div>
+          </div>
         </div>
-        <div className="card">
-          <h2>Pending Rent Payments</h2>
-          <p>3</p>
-          <div className="card-icon orange"><FaMoneyBill /></div>
+        
+        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
+          <div className="flex items-center justify-between">
+            <div>
+              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
+              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingPayments}</p>
+            </div>
+            <div className="bg-yellow-100 p-3 rounded-xl">
+              <FaMoneyBill className="w-6 h-6 text-yellow-600" />
+            </div>
+          </div>
+        </div>
+        
+        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
+          <div className="flex items-center justify-between">
+            <div>
+              <h3 className="text-sm font-medium text-gray-500">Open Requests</h3>
+              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.openRequests}</p>
+            </div>
+            <div className="bg-red-100 p-3 rounded-xl">
+              <FaTools className="w-6 h-6 text-red-600" />
+            </div>
+          </div>
         </div>
       </div>
 
-      {/* Table */}
-      <div className="table-container">
-        <h2 className="table-title">Recent Maintenance Requests</h2>
-        <table className="data-table">
-          <thead>
-            <tr>
-              <th>Property Name</th>
-              <th>Issue</th>
-              <th>Tenant</th>
-              <th>Status</th>
-              <th>Date</th>
-            </tr>
-          </thead>
-          <tbody>
-            <tr>
-              <td>Sunset Apartments #12A</td>
-              <td>Leaking faucet in kitchen</td>
-              <td>Sarah Johnson</td>
-              <td><span className="badge open">Open</span></td>
-              <td>20/1/2025</td>
-            </tr>
-            <tr>
-              <td>Oak Street House</td>
-              <td>Heating system not working</td>
-              <td>Michael Chen</td>
-              <td><span className="badge inprogress">In Progress</span></td>
-              <td>19/1/2025</td>
-            </tr>
-            <tr>
-              <td>Downtown Loft #5B</td>
-              <td>Broken window in bedroom</td>
-              <td>Emily Davis</td>
-              <td><span className="badge resolved">Resolved</span></td>
-              <td>18/1/2025</td>
-            </tr>
-          </tbody>
-        </table>
+      {/* Recent Maintenance Requests */}
+      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
+        <div className="px-6 py-4 border-b border-gray-200">
+          <h2 className="text-xl font-semibold text-gray-900">Recent Maintenance Requests</h2>
+        </div>
+        
+        {recentRequests.length > 0 ? (
+          <div className="overflow-x-auto">
+            <table className="min-w-full divide-y divide-gray-200">
+              <thead className="bg-gray-50">
+                <tr>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Property
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Issue
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Tenant
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Status
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Date
+                  </th>
+                </tr>
+              </thead>
+              <tbody className="bg-white divide-y divide-gray-200">
+                {recentRequests.map((request) => (
+                  <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-150">
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
+                      {request.property?.name || 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {request.title}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {request.tenant ? `${request.tenant.firstName} ${request.tenant.lastName}` : 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      {getStatusBadge(request.status)}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
+                      {new Date(request.createdAt).toLocaleDateString()}
+                    </td>
+                  </tr>
+                ))}
+              </tbody>
+            </table>
+          </div>
+        ) : (
+          <div className="px-6 py-12 text-center">
+            <FaTools className="w-12 h-12 text-gray-400 mx-auto mb-4" />
+            <p className="text-gray-500">No maintenance requests yet</p>
+            <Link
+              to="/maintenance"
+              className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
+            >
+              Create your first request
+            </Link>
+          </div>
+        )}
       </div>
     </div>
   );
 }