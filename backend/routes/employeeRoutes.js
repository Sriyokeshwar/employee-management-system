const express = require('express');

const router = express.Router();

const employeeController = require('../controllers/employeeControllers');


// Get All Employees
router.get(
    '/',
    employeeController.getEmployees
);


// Create Employee
router.post(
    '/',
    employeeController.addEmployee
);


// Update Employee
router.put(
    '/:id',
    employeeController.editEmployee
);


// Delete Employee
router.delete(
    '/:id',
    employeeController.removeEmployee
);


module.exports = router;