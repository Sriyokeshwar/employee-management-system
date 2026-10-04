/**
 * Input validation middleware for employee requests
 */

// Email regex pattern for format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex allowing optional '+', digits, spaces, hyphens, and parentheses
const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;

/**
 * Validate employee payload for Create and Update
 */
function validateEmployee(req, res, next) {
    const { name, role, email, phone } = req.body || {};

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedRole = typeof role === 'string' ? role.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';

    // Check required fields
    if (!trimmedName) {
        return res.status(400).json({
            success: false,
            message: 'Name is required.',
        });
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Name must be between 2 and 100 characters.',
        });
    }

    if (!trimmedRole) {
        return res.status(400).json({
            success: false,
            message: 'Role is required.',
        });
    }

    if (trimmedRole.length < 2 || trimmedRole.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Role must be between 2 and 100 characters.',
        });
    }

    if (!trimmedEmail) {
        return res.status(400).json({
            success: false,
            message: 'Email address is required.',
        });
    }

    if (trimmedEmail.length > 120 || !EMAIL_REGEX.test(trimmedEmail)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address.',
        });
    }

    if (!trimmedPhone) {
        return res.status(400).json({
            success: false,
            message: 'Phone number is required.',
        });
    }

    if (!PHONE_REGEX.test(trimmedPhone)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid phone number (7-20 digits).',
        });
    }

    // Attach sanitized values back to req.body
    req.body = {
        name: trimmedName,
        role: trimmedRole,
        email: trimmedEmail.toLowerCase(),
        phone: trimmedPhone,
    };

    next();
}

/**
 * Validate numeric ID param (e.g. /:id)
 */
function validateId(req, res, next) {
    const id = req.params.id;
    const numericId = Number(id);

    if (!id || !Number.isInteger(numericId) || numericId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid employee ID. ID must be a positive integer.',
        });
    }

    req.params.id = numericId;
    next();
}

module.exports = {
    validateEmployee,
    validateId,
};
