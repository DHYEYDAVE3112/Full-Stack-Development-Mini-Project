@@ .. @@
+import React, { useState, useEffect } from 'react';
+import { FaFileContract, FaPlus, FaEdit, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
+import { leasesAPI, tenantsAPI, propertiesAPI } from '../utils/api';
+import LeaseModal from '../components/LeaseModal';
+
 export default function LeasePage() {
-  return <h1 className="main-title">Lease Agreements Page</h1>;
+  const [leases, setLeases] = useState([]);
+  const [tenants, setTenants] = useState([]);
+  const [properties, setProperties] = useState([]);
+  const [loading, setLoading] = useState(true);
+  const [showModal, setShowModal] = useState(false);
+  const [editingLease, setEditingLease] = useState(null);
+
+  useEffect(() => {
+    fetchData();
+  }, []);
+
+  const fetchData = async () => {
+    try {
+      const [leasesData, tenantsData, propertiesData] = await Promise.all([
+        leasesAPI.getAll(),
+        tenantsAPI.getAll(),
+        propertiesAPI.getAll()
+      ]);
+      setLeases(leasesData);
+      setTenants(tenantsData);
+      setProperties(propertiesData);
+    } catch (error) {
+      console.error('Error fetching data:', error);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleAddLease = () => {
+    setEditingLease(null);
+    setShowModal(true);
+  };
+
+  const handleEditLease = (lease) => {
+    setEditingLease(lease);
+    setShowModal(true);
+  };
+
+  const handleDeleteLease = async (id) => {
+    if (window.confirm('Are you sure you want to delete this lease agreement?')) {
+      try {
+        await leasesAPI.delete(id);
+        fetchData();
+      } catch (error) {
+        console.error('Error deleting lease:', error);
+      }
+    }
+  };
+
+  const handleModalClose = () => {
+    setShowModal(false);
+    setEditingLease(null);
+    fetchData();
+  };
+
+  const getStatusBadge = (status) => {
+    const statusClasses = {
+      active: 'bg-green-100 text-green-800',
+      expired: 'bg-red-100 text-red-800',
+      terminated: 'bg-gray-100 text-gray-800'
+    };
+    
+    return (
+      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
+        {status.toUpperCase()}
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
+  return (
+    <div className="space-y-6">
+      <div className="flex justify-between items-center">
+        <div>
+          <h1 className="text-3xl font-bold text-gray-900">Lease Agreements</h1>
+          <p className="text-gray-600 mt-1">Manage tenant lease agreements and documents</p>
+        </div>
+        <button
+          onClick={handleAddLease}
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Lease</span>
+        </button>
+      </div>

+      {leases.length > 0 ? (
+        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
+          <div className="overflow-x-auto">
+            <table className="min-w-full divide-y divide-gray-200">
+              <thead className="bg-gray-50">
+                <tr>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Tenant
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Property
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Start Date
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    End Date
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Monthly Rent
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Status
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Document
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Actions
+                  </th>
+                </tr>
+              </thead>
+              <tbody className="bg-white divide-y divide-gray-200">
+                {leases.map((lease) => (
+                  <tr key={lease._id} className="hover:bg-gray-50 transition-colors duration-150">
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
+                      {lease.tenant ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {lease.property?.name || 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {new Date(lease.startDate).toLocaleDateString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {new Date(lease.endDate).toLocaleDateString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      ${lease.monthlyRent.toLocaleString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      {getStatusBadge(lease.status)}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {lease.documentPath ? (
+                        <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
+                          <FaEye className="w-4 h-4" />
+                          <span>View</span>
+                        </button>
+                      ) : (
+                        <span className="text-gray-400">No document</span>
+                      )}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
+                      <div className="flex space-x-2">
+                        <button
+                          onClick={() => handleEditLease(lease)}
+                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
+                        >
+                          <FaEdit className="w-4 h-4" />
+                        </button>
+                        <button
+                          onClick={() => handleDeleteLease(lease._id)}
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
+          <FaFileContract className="w-16 h-16 text-gray-400 mx-auto mb-4" />
+          <h3 className="text-xl font-semibold text-gray-900 mb-2">No lease agreements yet</h3>
+          <p className="text-gray-600 mb-6">Add your first lease agreement to get started</p>
+          <button
+            onClick={handleAddLease}
+            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
+          >
+            <FaPlus className="w-4 h-4" />
+            <span>Add Your First Lease</span>
+          </button>
+        </div>
+      )}

+      {showModal && (
+        <LeaseModal
+          lease={editingLease}
+          tenants={tenants}
+          properties={properties}
+          onClose={handleModalClose}
+        />
+      )}
+    </div>
+  );
 }