import React from 'react';
import { EditIcon, TrashIcon, UsersIcon, PlusIcon, CloseIcon } from './Icons';
import LoadingSkeleton from './LoadingSkeleton';

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

// Generate consistent avatar background color based on name
function getAvatarColor(name = '') {
  const colors = [
    '#2563eb', '#0284c7', '#0d9488', '#16a34a',
    '#d97706', '#9333ea', '#e11d48', '#4f46e5',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function EmployeeTable({
  employees = [],
  isLoading = false,
  isFiltered = false,
  onEdit,
  onDelete,
  onAddEmployee,
  onClearFilters,
}) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '90px' }}>EMP ID</th>
              <th scope="col">Employee</th>
              <th scope="col">Contact</th>
              <th scope="col">Department / Role</th>
              <th scope="col">Phone</th>
              <th scope="col">Joined Date</th>
              <th scope="col" className="text-right" style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingSkeleton rows={5} />
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">
                  <div className="empty-state-container">
                    <div className="empty-icon-wrapper">
                      <UsersIcon size={32} />
                    </div>
                    {isFiltered ? (
                      <>
                        <h3 className="empty-title">No matching employees</h3>
                        <p className="empty-subtitle">
                          No employee records match your search or filter criteria.
                        </p>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={onClearFilters}
                        >
                          <CloseIcon size={14} />
                          Clear filters
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="empty-title">No employees registered yet</h3>
                        <p className="empty-subtitle">
                          Get started by adding your first employee to the directory.
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={onAddEmployee}
                        >
                          <PlusIcon size={16} />
                          Add First Employee
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((employee) => {
                const initial = (employee.name || 'E').charAt(0).toUpperCase();
                const avatarBg = getAvatarColor(employee.name);

                return (
                  <tr key={employee.id} className="table-row">
                    {/* Employee ID */}
                    <td className="id-cell">
                      <span className="id-badge">#{employee.id}</span>
                    </td>

                    {/* Employee Profile (Avatar + Name) */}
                    <td>
                      <div className="employee-profile-cell">
                        <span
                          className="employee-avatar"
                          style={{ backgroundColor: avatarBg }}
                          aria-hidden="true"
                        >
                          {initial}
                        </span>
                        <div className="employee-info">
                          <strong className="employee-name">{employee.name}</strong>
                          <span className="employee-meta-id">ID: EMP-{String(employee.id).padStart(3, '0')}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Email */}
                    <td>
                      <a
                        href={`mailto:${employee.email}`}
                        className="email-link"
                        title={`Send email to ${employee.email}`}
                      >
                        {employee.email}
                      </a>
                    </td>

                    {/* Role badge */}
                    <td>
                      <span className="role-tag">
                        {employee.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="phone-cell">
                      <a href={`tel:${employee.phone}`} className="phone-link">
                        {employee.phone}
                      </a>
                    </td>

                    {/* Joining Date */}
                    <td className="date-cell">
                      {formatDate(employee.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="actions-cell">
                      <div className="actions-cluster">
                        <button
                          type="button"
                          className="action-icon-btn edit-action"
                          onClick={() => onEdit(employee)}
                          title={`Edit ${employee.name}`}
                          aria-label={`Edit ${employee.name}`}
                        >
                          <EditIcon size={15} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn delete-action"
                          onClick={() => onDelete(employee)}
                          title={`Delete ${employee.name}`}
                          aria-label={`Delete ${employee.name}`}
                        >
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
