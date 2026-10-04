const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeControllers');
const { validateEmployee, validateId } = require('../middleware/validator');

// GET /api/employees - List all employees
router.get('/', employeeController.getEmployees);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', validateId, employeeController.getEmployeeById);

// POST /api/employees - Create new employee
router.post('/', validateEmployee, employeeController.addEmployee);

// PUT /api/employees/:id - Update existing employee
router.put('/:id', validateId, validateEmployee, employeeController.editEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', validateId, employeeController.removeEmployee);

module.exports = router;