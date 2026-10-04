import React from 'react';
import { SearchIcon, CloseIcon } from './Icons';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  sortBy,
  onSortChange,
  availableRoles = [],
  totalCount = 0,
  filteredCount = 0,
  onResetFilters,
}) {
  const isFiltered = Boolean(searchTerm || (selectedRole && selectedRole !== 'all'));

  return (
    <div className="filter-toolbar">
      <div className="search-input-wrapper">
        <SearchIcon size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, role, or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search employees"
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      <div className="filter-actions-group">
        <div className="select-wrapper">
          <label htmlFor="role-filter" className="sr-only">Filter by Role</label>
          <select
            id="role-filter"
            className="filter-select"
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            <option value="all">All Roles ({availableRoles.length})</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrapper">
          <label htmlFor="sort-by" className="sr-only">Sort by</label>
          <select
            id="sort-by"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name (A–Z)</option>
            <option value="name_desc">Name (Z–A)</option>
          </select>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="btn btn-subtle btn-reset"
            onClick={onResetFilters}
            title="Reset filters"
          >
            <CloseIcon size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="results-counter">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> employees
      </div>
    </div>
  );
}
