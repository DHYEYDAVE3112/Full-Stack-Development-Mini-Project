@@ .. @@
+import React, { useState, useEffect } from 'react';
+import { FaUser, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
+import { tenantsAPI, propertiesAPI } from '../utils/api';
+import TenantModal from '../components/TenantModal';
+
 export default function TenantsPage() {
-  return <h1 className="main-title">Tenants Page</h1>;
+  const [tenants, setTenants] = useState([]);
+  const [properties, setProperties] = useState([]);
+  const [loading, setLoading] = useState(true);
+  const [showModal, setShowModal] = useState(false);
+  const [editingTenant, setEditingTenant] = useState(null);
+
+  useEffect(() => {
+    fetchData();
+  }, []);
+
+  const fetchData = async () => {
+    try {
+      const [tenantsData, propertiesData] = await Promise.all([
+        tenantsAPI.getAll(),
+        propertiesAPI.getAll()
+      ]);
+      setTenants(tenantsData);
+      setProperties(propertiesData);
+    } catch (error) {
+      console.error('Error fetching data:', error);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleAddTenant = () => {
+    setEditingTenant(null);
+    setShowModal(true);
+  };
+
+  const handleEditTenant = (tenant) => {
+    setEditingTenant(tenant);
+    setShowModal(true);
+  };
+
+  const handleDeleteTenant = async (id) => {
+    if (window.confirm('Are you sure you want to delete this tenant?')) {
+      try {
+        await tenantsAPI.delete(id);
+        fetchData();
+      } catch (error) {
+        console.error('Error deleting tenant:', error);
+      }
+    }
+  };
+
+  const handleModalClose = () => {
+    setShowModal(false);
+    setEditingTenant(null);
+    fetchData();
+  };
+
+  const getStatusBadge = (status) => {
+    return (
+      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
+        status === 'active' 
+          ? 'bg-green-100 text-green-800' 
+          : 'bg-red-100 text-red-800'
+      }`}>
+        {status.toUpperCase()}
+      </span>
+    );
+  };

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
+          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
+          <p className="text-gray-600 mt-1">Manage your tenant relationships</p>
+        </div>
+        <button
+          onClick={handleAddTenant}
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Tenant</span>
+        </button>
+      </div>

+      {tenants.length > 0 ? (
+        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
+          <div className="overflow-x-auto">
+            <table className="min-w-full divide-y divide-gray-200">
+              <thead className="bg-gray-50">
+                <tr>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Name
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Contact Info
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Property
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Lease Duration
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Status
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Actions
+                  </th>
+                </tr>
+              </thead>
+              <tbody className="bg-white divide-y divide-gray-200">
+                {tenants.map((tenant) => (
+                  <tr key={tenant._id} className="hover:bg-gray-50 transition-colors duration-150">
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
+                      {`${tenant.firstName} ${tenant.lastName}`}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      <div>
+                        <div>{tenant.email}</div>
+                        <div className="text-gray-500">{tenant.phone}</div>
+                      </div>
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {tenant.property?.name || 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {new Date(tenant.leaseStartDate).toLocaleDateString()} - {new Date(tenant.leaseEndDate).toLocaleDateString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      {getStatusBadge(tenant.status)}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
+                      <div className="flex space-x-2">
+                        <button
+                          onClick={() => handleEditTenant(tenant)}
+                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
+                        >
+                          <FaEdit className="w-4 h-4" />
+                        </button>
+                        <button
+                          onClick={() => handleDeleteTenant(tenant._id)}
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
+          <FaUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
+          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tenants yet</h3>
+          <p className="text-gray-600 mb-6">Add your first tenant to get started</p>
+          <button
+            onClick={handleAddTenant}
+            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
+          >
+            <FaPlus className="w-4 h-4" />
+            <span>Add Your First Tenant</span>
+          </button>
+        </div>
+      )}

+      {showModal && (
+        <TenantModal
+          tenant={editingTenant}
+          properties={properties}
+          onClose={handleModalClose}
+        />
+      )}
+    </div>
+  );
 }