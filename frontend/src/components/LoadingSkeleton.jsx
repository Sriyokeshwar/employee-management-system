import React from 'react';

export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={`skeleton-${idx}`} className="skeleton-row">
          <td>
            <div className="skeleton skeleton-badge" style={{ width: '45px' }} />
          </td>
          <td>
            <div className="skeleton-user-cell">
              <div className="skeleton skeleton-avatar" />
              <div className="skeleton-text-group">
                <div className="skeleton skeleton-line" style={{ width: '130px', height: '14px' }} />
                <div className="skeleton skeleton-line" style={{ width: '80px', height: '10px' }} />
              </div>
            </div>
          </td>
          <td>
            <div className="skeleton skeleton-line" style={{ width: '150px' }} />
          </td>
          <td>
            <div className="skeleton skeleton-pill" style={{ width: '90px' }} />
          </td>
          <td>
            <div className="skeleton skeleton-line" style={{ width: '110px' }} />
          </td>
          <td>
            <div className="skeleton skeleton-line" style={{ width: '85px' }} />
          </td>
          <td className="actions-cell">
            <div className="skeleton-actions">
              <div className="skeleton skeleton-btn" />
              <div className="skeleton skeleton-btn" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
