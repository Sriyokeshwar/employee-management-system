const employeeModel = require('../models/employeeModels');

/**
 * GET /api/employees
 * Retrieve all employees
 */
async function getEmployees(req, res, next) {
    try {
        const employees = await employeeModel.getAllEmployees();

        return res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/employees/:id
 * Retrieve single employee by ID
 */
async function getEmployeeById(req, res, next) {
    try {
        const employee = await employeeModel.getEmployeeById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.',
            });
        }

        return res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/employees
 * Create a new employee
 */
async function addEmployee(req, res, next) {
    const { name, role, email, phone } = req.body;

    try {
        // Check for duplicate email
        const existing = await employeeModel.getEmployeeByEmail(email);
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'An employee with this email already exists.',
            });
        }

        const newEmployee = await employeeModel.createEmployee(
            name,
            role,
            email,
            phone
        );

        return res.status(201).json({
            success: true,
            message: 'Employee added successfully.',
            data: newEmployee,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/employees/:id
 * Update an existing employee
 */
async function editEmployee(req, res, next) {
    const id = req.params.id;
    const { name, role, email, phone } = req.body;

    try {
        // Verify employee exists
        const currentEmployee = await employeeModel.getEmployeeById(id);
        if (!currentEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.',
            });
        }

        // Check if email is in use by another employee
        const existingWithEmail = await employeeModel.getEmployeeByEmail(email);
        if (existingWithEmail && existingWithEmail.id !== id) {
            return res.status(409).json({
                success: false,
                message: 'An employee with this email already exists.',
            });
        }

        const updatedEmployee = await employeeModel.updateEmployee(
            id,
            name,
            role,
            email,
            phone
        );

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully.',
            data: updatedEmployee,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/employees/:id
 * Remove an employee
 */
async function removeEmployee(req, res, next) {
    const id = req.params.id;

    try {
        const employee = await employeeModel.getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.',
            });
        }

        await employeeModel.deleteEmployee(id);

        return res.status(200).json({
            success: true,
            message: 'Employee deleted successfully.',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getEmployees,
    getEmployeeById,
    addEmployee,
    editEmployee,
    removeEmployee,
};