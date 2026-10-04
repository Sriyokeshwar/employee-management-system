/**
 * Centralized error handler middleware
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    console.error('Unhandled Application Error:', err);

    // MySQL Duplicate Entry error
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'An employee with this email address already exists.',
        });
    }

    // JSON parsing error in request body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Malformed JSON payload in request body.',
        });
    }

    // Default 500 internal server error
    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode === 500
        ? 'Internal server error. Please try again later.'
        : (err.message || 'An error occurred.');

    return res.status(statusCode).json({
        success: false,
        message,
    });
}

/**
 * 404 Not Found handler for undefined routes
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    });
}

module.exports = {
    errorHandler,
    notFoundHandler,
};
