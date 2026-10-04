import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from './services/api';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { AlertCircleIcon, RefreshIcon } from './components/Icons';
import './App.css';

export default function App() {
  // --- Data & Network State ---
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'
  const [fetchError, setFetchError] = useState(null);

  // --- Search, Filter & Sort State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // --- Modal State (Add / Edit) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalServerError, setModalServerError] = useState('');

  // --- Delete Modal State ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Toast Notification State ---
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  // Check health and load employees
  const loadEmployees = useCallback(async (isBackgroundRefresh = false) => {
    if (isBackgroundRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setFetchError(null);

    try {
      // Fetch employees
      const data = await api.getEmployees();
      setEmployees(data);
      setApiStatus('connected');
    } catch (err) {
      console.error('Failed to load employees:', err);
      setFetchError(err.message || 'Unable to connect to the backend server.');
      setApiStatus('disconnected');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Extract unique roles for the filter dropdown
  const availableRoles = useMemo(() => {
    const rolesSet = new Set();
    employees.forEach((emp) => {
      if (emp.role && emp.role.trim()) {
        rolesSet.add(emp.role.trim());
      }
    });
    return Array.from(rolesSet).sort();
  }, [employees]);

  // Client-side search, filter and sort
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((emp) => {
        const idMatch = String(emp.id).toLowerCase().includes(q) || `emp-${emp.id}`.toLowerCase().includes(q);
        const nameMatch = (emp.name || '').toLowerCase().includes(q);
        const emailMatch = (emp.email || '').toLowerCase().includes(q);
        const roleMatch = (emp.role || '').toLowerCase().includes(q);
        return idMatch || nameMatch || emailMatch || roleMatch;
      });
    }

    // Role filter
    if (selectedRole && selectedRole !== 'all') {
      result = result.filter(
        (emp) => (emp.role || '').toLowerCase() === selectedRole.toLowerCase()
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
        return timeA - timeB;
      }
      if (sortBy === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name_desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });

    return result;
  }, [employees, searchTerm, selectedRole, sortBy]);

  // Reset search filters
  function handleResetFilters() {
    setSearchTerm('');
    setSelectedRole('all');
    setSortBy('newest');
  }

  // --- Modal Open Handlers ---
  function handleOpenAddModal() {
    setEditingEmployee(null);
    setModalServerError('');
    setIsModalOpen(true);
  }

  function handleOpenEditModal(employee) {
    setEditingEmployee(employee);
    setModalServerError('');
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingEmployee(null);
    setModalServerError('');
  }

  // --- Submit Handler (Create or Update) ---
  async function handleFormSubmit(formData) {
    setIsSubmitting(true);
    setModalServerError('');

    try {
      if (editingEmployee) {
        // PUT update
        const updated = await api.updateEmployee(editingEmployee.id, formData);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === editingEmployee.id ? updated : emp))
        );
        showToast('Employee updated successfully.', 'success');
      } else {
        // POST create
        const created = await api.createEmployee(formData);
        setEmployees((prev) => [created, ...prev]);
        showToast('Employee added successfully.', 'success');
      }

      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error('Save employee error:', err);
      setModalServerError(err.message || 'Unable to save employee. Please try again.');
      showToast(err.message || 'Unable to save employee. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Delete Handlers ---
  function handleOpenDeleteModal(employee) {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  }

  async function handleConfirmDelete(id) {
    setIsDeleting(true);

    try {
      await api.deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      showToast('Employee deleted successfully.', 'success');
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error('Delete employee error:', err);
      showToast(err.message || 'Unable to delete employee. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  const isFiltered = Boolean(searchTerm || (selectedRole && selectedRole !== 'all'));

  return (
    <div className="dashboard-shell">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="dashboard-container">
        {/* Top Header */}
        <Header
          onAddEmployee={handleOpenAddModal}
          onRefresh={() => loadEmployees(true)}
          isRefreshing={isRefreshing}
          apiStatus={apiStatus}
        />

        {/* Global Connection Error Banner */}
        {fetchError && (
          <div className="connection-error-card" role="alert">
            <div className="connection-error-body">
              <AlertCircleIcon size={24} className="text-danger" />
              <div>
                <h3 className="error-card-title">Unable to connect to the backend server</h3>
                <p className="error-card-desc">
                  {fetchError} Please ensure the backend server is running on <code>http://localhost:5000</code> and the MySQL database is accessible.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loadEmployees(false)}
            >
              <RefreshIcon size={14} />
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Statistics Cards */}
        <StatsCards employees={employees} />

        {/* Search, Filter & Sort Toolbar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableRoles={availableRoles}
          totalCount={employees.length}
          filteredCount={filteredEmployees.length}
          onResetFilters={handleResetFilters}
        />

        {/* Main Employee Data Table */}
        <EmployeeTable
          employees={filteredEmployees}
          isLoading={isLoading}
          isFiltered={isFiltered}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onAddEmployee={handleOpenAddModal}
          onClearFilters={handleResetFilters}
        />
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        isSubmitting={isSubmitting}
        serverError={modalServerError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employee={employeeToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
