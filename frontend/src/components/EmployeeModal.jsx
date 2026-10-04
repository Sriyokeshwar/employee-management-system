import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employee = null,
  isSubmitting = false,
  serverError = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(employee);

  // Synchronize form state when opening modal or selecting employee to edit
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        email: employee.email || '',
        phone: employee.phone || '',
      });
    } else {
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
      });
    }
    setTouched({});
    setErrors({});
  }, [employee, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Validation function
  function validate(fields = formData) {
    const newErrors = {};

    const name = (fields.name || '').trim();
    if (!name) {
      newErrors.name = 'Full name is required.';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    } else if (name.length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters.';
    }

    const role = (fields.role || '').trim();
    if (!role) {
      newErrors.role = 'Role or department is required.';
    } else if (role.length < 2) {
      newErrors.role = 'Role must be at least 2 characters.';
    } else if (role.length > 100) {
      newErrors.role = 'Role cannot exceed 100 characters.';
    }

    const email = (fields.email || '').trim();
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    } else if (email.length > 120) {
      newErrors.email = 'Email cannot exceed 120 characters.';
    }

    const phone = (fields.phone || '').trim();
    if (!phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!PHONE_REGEX.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number (7-20 digits).';
    }

    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Validate on the fly if already touched
    if (touched[name]) {
      const validationErrors = validate(updated);
      setErrors(validationErrors);
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      role: true,
      email: true,
      phone: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      role: formData.role.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    });
  }

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              {isEditing ? 'Update Record' : 'New Registration'}
            </span>
            <h2 id="employee-modal-title" className="modal-title">
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {serverError && (
          <div className="form-server-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Priya Sharma"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              autoFocus
            />
            {touched.name && errors.name && (
              <span className="field-error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="role" className="form-label">
              Role / Department <span className="text-danger">*</span>
            </label>
            <input
              id="role"
              name="role"
              type="text"
              className={`form-input ${touched.role && errors.role ? 'input-error' : ''}`}
              placeholder="e.g. Frontend Engineer"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.role && errors.role && (
              <span className="field-error-message">{errors.role}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${touched.email && errors.email ? 'input-error' : ''}`}
              placeholder="e.g. priya.sharma@company.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.email && errors.email && (
              <span className="field-error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="phone" className="form-label">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form-input ${touched.phone && errors.phone ? 'input-error' : ''}`}
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.phone && errors.phone && (
              <span className="field-error-message">{errors.phone}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
