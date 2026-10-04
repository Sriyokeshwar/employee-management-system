import React, { useEffect } from 'react';
import { CheckCircleIcon, AlertCircleIcon, CloseIcon } from './Icons';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast-card toast-${toast.type || 'info'}`}>
        <div className="toast-icon">
          {isSuccess ? <CheckCircleIcon size={20} /> : <AlertCircleIcon size={20} />}
        </div>
        <div className="toast-message">{toast.message}</div>
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>
  );
}
