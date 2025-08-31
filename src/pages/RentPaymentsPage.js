@@ .. @@
+import React, { useState, useEffect } from 'react';
+import { FaMoneyBill, FaPlus, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
+import { rentPaymentsAPI, tenantsAPI, propertiesAPI } from '../utils/api';
+import RentPaymentModal from '../components/RentPaymentModal';
+
 export default function RentPaymentsPage() {
-  return <h1 className="main-title">Rent Payments Page</h1>;
+  const [payments, setPayments] = useState([]);
+  const [tenants, setTenants] = useState([]);
+  const [properties, setProperties] = useState([]);
+  const [loading, setLoading] = useState(true);
+  const [showModal, setShowModal] = useState(false);
+  const [editingPayment, setEditingPayment] = useState(null);
+  const [filter, setFilter] = useState('all');
+
+  useEffect(() => {
+    fetchData();
+  }, []);
+
+  const fetchData = async () => {
+    try {
+      const [paymentsData, tenantsData, propertiesData] = await Promise.all([
+        rentPaymentsAPI.getAll(),
+        tenantsAPI.getAll(),
+        propertiesAPI.getAll()
+      ]);
+      setPayments(paymentsData);
+      setTenants(tenantsData);
+      setProperties(propertiesData);
+    } catch (error) {
+      console.error('Error fetching data:', error);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleAddPayment = () => {
+    setEditingPayment(null);
+    setShowModal(true);
+  };
+
+  const handleEditPayment = (payment) => {
+    setEditingPayment(payment);
+    setShowModal(true);
+  };
+
+  const handleMarkAsPaid = async (payment) => {
+    try {
+      await rentPaymentsAPI.update(payment._id, {
+        status: 'paid',
+        paidDate: new Date().toISOString()
+      });
+      fetchData();
+    } catch (error) {
+      console.error('Error updating payment:', error);
+    }
+  };
+
+  const handleDeletePayment = async (id) => {
+    if (window.confirm('Are you sure you want to delete this payment record?')) {
+      try {
+        await rentPaymentsAPI.delete(id);
+        fetchData();
+      } catch (error) {
+        console.error('Error deleting payment:', error);
+      }
+    }
+  };
+
+  const handleModalClose = () => {
+    setShowModal(false);
+    setEditingPayment(null);
+    fetchData();
+  };
+
+  const getStatusBadge = (status) => {
+    const statusClasses = {
+      pending: 'bg-yellow-100 text-yellow-800',
+      paid: 'bg-green-100 text-green-800',
+      late: 'bg-red-100 text-red-800'
+    };
+    
+    return (
+      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
+        {status.toUpperCase()}
+      </span>
+    );
+  };
+
+  const filteredPayments = payments.filter(payment => {
+    if (filter === 'all') return true;
+    return payment.status === filter;
+  });
+
+  const totalCollected = payments
+    .filter(p => p.status === 'paid')
+    .reduce((sum, p) => sum + p.amount, 0);
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
+          <h1 className="text-3xl font-bold text-gray-900">Rent Payments</h1>
+          <p className="text-gray-600 mt-1">Track and manage rent payments</p>
+        </div>
+        <button
+          onClick={handleAddPayment}
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
+        >
+          <FaPlus className="w-4 h-4" />
+          <span>Add Payment</span>
+        </button>
+      </div>
+
+      {/* Summary Stats */}
+      <div className="bg-white p-6 rounded-2xl shadow-md">
+        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Summary</h3>
+        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
+          <div className="text-center">
+            <div className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</div>
+            <div className="text-sm text-gray-600">Total Collected</div>
+          </div>
+          <div className="text-center">
+            <div className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'pending').length}</div>
+            <div className="text-sm text-gray-600">Pending Payments</div>
+          </div>
+          <div className="text-center">
+            <div className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === 'late').length}</div>
+            <div className="text-sm text-gray-600">Late Payments</div>
+          </div>
+        </div>
+      </div>
+
+      {/* Filter Buttons */}
+      <div className="flex space-x-2">
+        {['all', 'pending', 'paid', 'late'].map((status) => (
+          <button
+            key={status}
+            onClick={() => setFilter(status)}
+            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
+              filter === status
+                ? 'bg-blue-600 text-white'
+                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
+            }`}
+          >
+            {status.charAt(0).toUpperCase() + status.slice(1)}
+          </button>
+        ))}
+      </div>
+
+      {filteredPayments.length > 0 ? (
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
+                    Amount
+                  </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Due Date
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
+                {filteredPayments.map((payment) => (
+                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
+                      {payment.tenant ? `${payment.tenant.firstName} ${payment.tenant.lastName}` : 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {payment.property?.name || 'N/A'}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      ${payment.amount.toLocaleString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
+                      {new Date(payment.dueDate).toLocaleDateString()}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      {getStatusBadge(payment.status)}
+                    </td>
+                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
+                      <div className="flex space-x-2">
+                        {payment.status === 'pending' && (
+                          <button
+                            onClick={() => handleMarkAsPaid(payment)}
+                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors duration-200"
+                            title="Mark as Paid"
+                          >
+                            <FaCheck className="w-4 h-4" />
+                          </button>
+                        )}
+                        <button
+                          onClick={() => handleEditPayment(payment)}
+                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
+                        >
+                          <FaEdit className="w-4 h-4" />
+                        </button>
+                        <button
+                          onClick={() => handleDeletePayment(payment._id)}
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
+          <FaMoneyBill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
+          <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
+          <p className="text-gray-600 mb-6">Add your first payment record to get started</p>
+          <button
+            onClick={handleAddPayment}
+            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
+          >
+            <FaPlus className="w-4 h-4" />
+            <span>Add Your First Payment</span>
+          </button>
+        </div>
+      )}
+
+      {showModal && (
+        <RentPaymentModal
+          payment={editingPayment}
+          tenants={tenants}
+          properties={properties}
+          onClose={handleModalClose}
+        />
+      )}
+    </div>
+  );
 }