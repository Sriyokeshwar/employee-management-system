import React, { useMemo } from 'react';
import { UsersIcon, BriefcaseIcon, SparklesIcon, CalendarIcon } from './Icons';

export default function StatsCards({ employees = [] }) {
  const stats = useMemo(() => {
    const total = employees.length;

    // Distinct roles / departments
    const roleCounts = {};
    employees.forEach((emp) => {
      const role = emp.role || 'Unassigned';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const uniqueRolesCount = Object.keys(roleCounts).length;

    // Top role
    let topRole = 'None';
    let topCount = 0;
    Object.entries(roleCounts).forEach(([role, count]) => {
      if (count > topCount) {
        topCount = count;
        topRole = role;
      }
    });

    // Most recently added employee
    let latestEmployee = null;
    if (employees.length > 0) {
      // Find employee with latest created_at or highest id
      latestEmployee = [...employees].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
        return timeB - timeA;
      })[0];
    }

    return {
      total,
      uniqueRolesCount,
      topRole: topCount > 0 ? `${topRole} (${topCount})` : '—',
      recentlyAdded: latestEmployee ? latestEmployee.name : '—',
    };
  }, [employees]);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-blue">
          <UsersIcon size={22} />
        </div>
        <div className="stat-details">
          <span className="stat-label">Total Employees</span>
          <strong className="stat-value">{stats.total}</strong>
          <span className="stat-meta">Active team members</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-cyan">
          <BriefcaseIcon size={22} />
        </div>
        <div className="stat-details">
          <span className="stat-label">Active Roles</span>
          <strong className="stat-value">{stats.uniqueRolesCount}</strong>
          <span className="stat-meta">Across organization</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-indigo">
          <SparklesIcon size={22} />
        </div>
        <div className="stat-details">
          <span className="stat-label">Top Department</span>
          <strong className="stat-value stat-truncate" title={stats.topRole}>
            {stats.topRole}
          </strong>
          <span className="stat-meta">Most represented</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-emerald">
          <CalendarIcon size={22} />
        </div>
        <div className="stat-details">
          <span className="stat-label">Recently Added</span>
          <strong className="stat-value stat-truncate" title={stats.recentlyAdded}>
            {stats.recentlyAdded}
          </strong>
          <span className="stat-meta">Latest onboarded</span>
        </div>
      </div>
    </div>
  );
}
