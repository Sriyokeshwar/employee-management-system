const pool = require('../config/db');

/**
 * Fetch all employees ordered by creation date descending
 */
async function getAllEmployees() {
    const [rows] = await pool.query(
        'SELECT id, name, role, email, phone, created_at FROM employees ORDER BY created_at DESC'
    );

    return rows;
}

/**
 * Fetch a single employee by their ID
 */
async function getEmployeeById(id) {
    const [rows] = await pool.execute(
        'SELECT id, name, role, email, phone, created_at FROM employees WHERE id = ?',
        [id]
    );

    return rows[0] || null;
}

/**
 * Find an employee by email address
 */
async function getEmployeeByEmail(email) {
    const [rows] = await pool.execute(
        'SELECT id, name, role, email, phone, created_at FROM employees WHERE email = ?',
        [email]
    );

    return rows[0] || null;
}

/**
 * Insert a new employee record
 */
async function createEmployee(name, role, email, phone) {
    const [result] = await pool.execute(
        'INSERT INTO employees (name, role, email, phone) VALUES (?, ?, ?, ?)',
        [name, role, email, phone]
    );

    return getEmployeeById(result.insertId);
}

/**
 * Update an existing employee record
 */
async function updateEmployee(id, name, role, email, phone) {
    const [result] = await pool.execute(
        'UPDATE employees SET name = ?, role = ?, email = ?, phone = ? WHERE id = ?',
        [name, role, email, phone, id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getEmployeeById(id);
}

/**
 * Delete an employee record by ID
 */
async function deleteEmployee(id) {
    const [result] = await pool.execute(
        'DELETE FROM employees WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    getEmployeeByEmail,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};