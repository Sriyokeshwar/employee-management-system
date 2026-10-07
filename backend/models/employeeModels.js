const pool = require('../config/db');

async function getAllEmployees() {
    const [rows] = await pool.query(
        'SELECT id, name, role, email, phone, created_at FROM employees ORDER BY created_at DESC'
    );

    return rows;
}


// Oru ID-kku mattum employee-ai edukka
async function getEmployeeById(id) {
    const [rows] = await pool.execute(
        'SELECT id, name, role, email, phone, created_at FROM employees WHERE id = ?',
        [id]
    );

    return rows[0];
}


// Puthu employee-ai insert panna
async function createEmployee(name, role, email, phone) {
    const [result] = await pool.execute(
        'INSERT INTO employees (name, role, email, phone) VALUES (?, ?, ?, ?)',
        [name, role, email, phone]
    );

    return getEmployeeById(result.insertId);
}


// Employee details-ah update panna
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


// Employee-ai delete panna
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
    createEmployee,
    updateEmployee,
    deleteEmployee,
};