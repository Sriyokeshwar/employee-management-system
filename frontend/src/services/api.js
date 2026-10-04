/**
 * Centralized API service for communicating with the backend REST API
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

/**
 * Helper to process JSON response and handle HTTP errors
 */
async function handleResponse(response) {
  let result = null;
  try {
    const text = await response.text();
    result = text ? JSON.parse(text) : null;
  } catch {
    // If not valid JSON
    result = null;
  }

  if (!response.ok) {
    const message = result?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = result;
    throw error;
  }

  return result;
}

/**
 * Safe fetch wrapper with timeout
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your backend connection.');
    }
    throw error;
  }
}

export const api = {
  /**
   * Fetch all employees
   */
  async getEmployees() {
    const res = await request('/employees');
    // Support both { success: true, data: [...] } and legacy [...] responses
    return Array.isArray(res) ? res : (res?.data || []);
  },

  /**
   * Fetch single employee by ID
   */
  async getEmployeeById(id) {
    const res = await request(`/employees/${id}`);
    return res?.data || res;
  },

  /**
   * Create a new employee
   */
  async createEmployee(employeeData) {
    const res = await request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
    return res?.data || res;
  },

  /**
   * Update an existing employee
   */
  async updateEmployee(id, employeeData) {
    const res = await request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
    return res?.data || res;
  },

  /**
   * Delete an employee
   */
  async deleteEmployee(id) {
    return await request(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Health check
   */
  async checkHealth() {
    return await request('/health');
  },
};

export default api;
