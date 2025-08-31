@@ .. @@
+import React, { useState, useEffect } from 'react';
+import { FaTools, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
+import { maintenanceAPI, tenantsAPI, propertiesAPI } from '../utils/api';
+import MaintenanceModal from '../components/MaintenanceModal';
+
 export default function MaintenancePage() {
-  return <h1 className="main-title">Maintenance Requests Page</h1>;
+  const [requests, setRequests] = useState([]);
+  const [tenants, setTenants] = useState([]);
+  const [properties, setProperties] = useState([]);
+  const [loading, setLoading] = useState(true);
+  const [showModal, setShowModal] = useState(false);
+  const [editingRequest, setEditingRequest] = useState(null);
+  const [filter, setFilter] = useState('all');
+
+  useEffect(() => {
+    fetchData();
+  }, []);
+
+  const fetchData = async () => {
+    try {
+      const [requestsData, tenantsData, propertiesData] = await Promise.all([
+        maintenanceAPI.getAll(),
+        tenantsAPI.getAll(),
+        propertiesAPI.getAll()
+      ]);
+      setRequests(requestsData);
+      setTenants(tenantsData);
+      setProperties(propertiesData);
+    } catch (error) {
+      console.error('Error fetching data:', error);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleAddRequest = () => {
+    setEditingRequest(null);
+    setShowModal(true);
+  };
+
+  const handleEditRequest = (request) => {
+    setEditingRequest(request);
+    setShowModal(true);
+  };
+
+  const handleDeleteRequest = async (id) => {
+    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
+      try {
+        await maintenanceAPI.delete(id);
+        fetchData();
+      } catch (error) {
+        console.error('Error deleting request:', error);
+      }
+    }
+  };
+
+  const handleStatusUpdate = async (id, newStatus) => {
+    try {
+      await maintenanceAPI.update(id, { 
+        status: newStatus,
+        ...(newStatus === 'resolved' && { completedDate: new Date().toISOString() })
+      });
+      fetchData();
+    } catch (error) {
+      console.error('Error updating status:', error);
+    }
+  };
+
+  const handleModalClose = () => {
+    setShowModal(false);
+    setEditingRequest(null);
+    fetchData();
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
+  const getPriorityBadge = (priority) => {
+    const priorityClasses = {
+      low: 'bg-gray-100 text-gray-800',
+      medium: 'bg-yellow-100 text-yellow-800',
+      high: 'bg-orange-100 text-orange-800',
+      urgent: 'bg-red-100 text-red-800'
+    };
+    
+    return (
+      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClasses[priority]}`}>
+        {priority.toUpperCase()}
+      </span>
+    );
+  };
+
+  const filteredRequests = requests.filter(request => {
+    if (filter === 'all') return true;
+    return request.status === filter;
+  });
+
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-64">
+        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
+      </div>
+    );
+  }
+
+  return (
+    <div className="space-y-6">
+      <div className="flex justify-between items-center">
+        <div>
+          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
+          <p className="text-gray-600 mt-1">Track and manage property maintenance</p>
+        </div>
+        <button
+          onClick={handleAddRequest}
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Request</span>
+        </button>
+      </div>

+      {/* Filter Buttons */}
+      <div className="flex space-x-2">
+        {['all', 'open', 'in_progress', 'resolved'].map((status) => (
+          <button
+            key={status}
+            onClick={() => setFilter(status)}
+            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
+              filter === status
+                ? 'bg-blue-600 text-white'
+                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
+            }`}
+          >
+            {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
+          </button>
+        ))}
+      </div>

+      {filteredRequests.length > 0 ? (
+        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
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
+                    Priority
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Status
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Date
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Actions
+                  </th>
+                </tr>
+              </thead>
+              <tbody className="bg-white divide-y divide-gray-200">
+                {filteredRequests.map((request) => (
+                  <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-150">
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
+                      {request.property?.name || 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 text-sm text-gray-900">
+                      <div>
+                        <div className="font-medium">{request.title}</div>
+                        <div className="text-gray-500 text-xs">{request.category}</div>
+                      </div>
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {request.tenant ? `${request.tenant.firstName} ${request.tenant.lastName}` : 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      {getPriorityBadge(request.priority)}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      <select
+                        value={request.status}
+                        onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
+                        className="text-xs border-0 bg-transparent focus:ring-0 cursor-pointer"
+                      >
+                        <option value="open">Open</option>
+                        <option value="in_progress">In Progress</option>
+                        <option value="resolved">Resolved</option>
+                      </select>
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
+                      {new Date(request.createdAt).toLocaleDateString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
+                      <div className="flex space-x-2">
+                        <button
+                          onClick={() => handleEditRequest(request)}
+                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
+                        >
+                          <FaEdit className="w-4 h-4" />
+                        </button>
+                        <button
+                          onClick={() => handleDeleteRequest(request._id)}
+                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
+                        >
+                          <FaTrash className="w-4 h-4" />
+                        </button>
+                      </div>
+                    </td>
+                  </tr>
+                ))}
+              </tbody>
+            </table>
+          </div>
+        </div>
+      ) : (
+        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
+          <FaTools className="w-16 h-16 text-gray-400 mx-auto mb-4" />
+          <h3 className="text-xl font-semibold text-gray-900 mb-2">No maintenance requests yet</h3>
+          <p className="text-gray-600 mb-6">Add your first maintenance request to get started</p>
+          <button
+            onClick={handleAddRequest}
+            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
+          >
+            <FaPlus className="w-4 h-4" />
+            <span>Add Your First Request</span>
+          </button>
+        </div>
+      )}

+      {showModal && (
+        <MaintenanceModal
+          request={editingRequest}
+          tenants={tenants}
+          properties={properties}
+          onClose={handleModalClose}
+        />
+      )}
+    </div>
+  );
 }