const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (propertyData) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    });
    return response.json();
  },

  update: async (id, propertyData) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Tenants API
export const tenantsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (tenantData) => {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tenantData)
    });
    return response.json();
  },

  update: async (id, tenantData) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tenantData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Rent Payments API
export const rentPaymentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/rent-payments`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/rent-payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  update: async (id, paymentData) => {
    const response = await fetch(`${API_BASE_URL}/rent-payments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/rent-payments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Maintenance API
export const maintenanceAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    return response.json();
  },

  update: async (id, requestData) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Lease Agreements API
export const leasesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/leases`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (leaseData) => {
    const response = await fetch(`${API_BASE_URL}/leases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leaseData)
    });
    return response.json();
  },

  update: async (id, leaseData) => {
    const response = await fetch(`${API_BASE_URL}/leases/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(leaseData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/leases/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};