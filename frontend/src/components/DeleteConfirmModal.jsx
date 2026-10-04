import React, { useEffect } from 'react';
import { TrashIcon, CloseIcon, AlertCircleIcon } from './Icons';

export default function DeleteConfirmModal({
  isOpen,
  employee,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  // Close with Esc key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !employee) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-card modal-card-sm">
        <div className="modal-header">
          <div className="delete-icon-badge">
            <TrashIcon size={24} />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="modal-body-delete">
          <h2 id="delete-modal-title" className="modal-title">
            Delete Employee
          </h2>
          <p className="delete-warning-text">
            Are you sure you want to delete <strong>{employee.name}</strong>?
          </p>

          <div className="delete-employee-preview">
            <span className="preview-label">Role:</span>
            <span className="preview-value">{employee.role}</span>
            <span className="preview-label">Email:</span>
            <span className="preview-value">{employee.email}</span>
          </div>

          <div className="delete-caution-notice">
            <AlertCircleIcon size={16} />
            <span>This action cannot be undone. The employee record will be permanently removed.</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(employee.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border" />
                Deleting...
              </>
            ) : (
              'Delete Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
