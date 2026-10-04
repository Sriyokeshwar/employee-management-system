import React from 'react';
import { PlusIcon, RefreshIcon } from './Icons';

export default function Header({
  onAddEmployee,
  onRefresh,
  isRefreshing = false,
  apiStatus = 'checking', // 'connected' | 'disconnected' | 'checking'
}) {
  return (
    <header className="dashboard-header">
      <div className="header-brand-section">
        <div className="brand-meta">
          <span className="brand-tag">Workforce Operations</span>
          <div className={`status-pill status-${apiStatus}`}>
            <span className="status-dot" />
            <span className="status-text">
              {apiStatus === 'connected'
                ? 'Database Connected'
                : apiStatus === 'disconnected'
                ? 'API Disconnected'
                : 'Checking API...'}
            </span>
          </div>
        </div>
        <h1 className="header-title">Employee Management System</h1>
        <p className="header-subtitle">
          Manage employee profiles, monitor organizational roles, and maintain accurate team directories.
        </p>
      </div>

      <div className="header-cta-section">
        <button
          type="button"
          className="btn btn-secondary btn-icon-only"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh employee data"
          aria-label="Refresh data"
        >
          <RefreshIcon size={16} className={isRefreshing ? 'spin-icon' : ''} />
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onAddEmployee}
        >
          <PlusIcon size={18} />
          <span>Add Employee</span>
        </button>
      </div>
    </header>
  );
}