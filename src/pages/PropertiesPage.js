@@ .. @@
+import React, { useState, useEffect } from 'react';
+import { FaBuilding, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
+import { propertiesAPI } from '../utils/api';
+import PropertyModal from '../components/PropertyModal';
+
 export default function PropertiesPage() {
-  return <h1 className="main-title">Properties Page</h1>;
+  const [properties, setProperties] = useState([]);
+  const [loading, setLoading] = useState(true);
+  const [showModal, setShowModal] = useState(false);
+  const [editingProperty, setEditingProperty] = useState(null);
+
+  useEffect(() => {
+    fetchProperties();
+  }, []);
+
+  const fetchProperties = async () => {
+    try {
+      const data = await propertiesAPI.getAll();
+      setProperties(data);
+    } catch (error) {
+      console.error('Error fetching properties:', error);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleAddProperty = () => {
+    setEditingProperty(null);
+    setShowModal(true);
+  };
+
+  const handleEditProperty = (property) => {
+    setEditingProperty(property);
+    setShowModal(true);
+  };
+
+  const handleDeleteProperty = async (id) => {
+    if (window.confirm('Are you sure you want to delete this property?')) {
+      try {
+        await propertiesAPI.delete(id);
+        fetchProperties();
+      } catch (error) {
+        console.error('Error deleting property:', error);
+      }
+    }
+  };
+
+  const handleModalClose = () => {
+    setShowModal(false);
+    setEditingProperty(null);
+    fetchProperties();
+  };
+
+  const getStatusBadge = (status) => {
+    return (
+      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
+        status === 'occupied' 
+          ? 'bg-green-100 text-green-800' 
+          : 'bg-gray-100 text-gray-800'
+      }`}>
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
+          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
+          <p className="text-gray-600 mt-1">Manage your rental properties</p>
+        </div>
+        <button
+          onClick={handleAddProperty}
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Property</span>
+        </button>
+      </div>
+
+      {properties.length > 0 ? (
+        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
+          <div className="overflow-x-auto">
+            <table className="min-w-full divide-y divide-gray-200">
+              <thead className="bg-gray-50">
+                <tr>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Property Name
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Address
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Type
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Monthly Rent
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
+                {properties.map((property) => (
+                  <tr key={property._id} className="hover:bg-gray-50 transition-colors duration-150">
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
+                      {property.name}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {`${property.address.street}, ${property.address.city}, ${property.address.state}`}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
+                      {property.type}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      ${property.monthlyRent.toLocaleString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      {getStatusBadge(property.status)}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
+                      <div className="flex space-x-2">
+                        <button
+                          onClick={() => handleEditProperty(property)}
+                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
+                        >
+                          <FaEdit className="w-4 h-4" />
+                        </button>
+                        <button
+                          onClick={() => handleDeleteProperty(property._id)}
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
+          <FaBuilding className="w-16 h-16 text-gray-400 mx-auto mb-4" />
+          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
+          <p className="text-gray-600 mb-6">Get started by adding your first property</p>
+          <button
+            onClick={handleAddProperty}
+            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
+          >
+            <FaPlus className="w-4 h-4" />
+            <span>Add Your First Property</span>
+          </button>
+        </div>
+      )}
+
+      {showModal && (
+        <PropertyModal
+          property={editingProperty}
+          onClose={handleModalClose}
+        />
+      )}
+    </div>
+  );
 }