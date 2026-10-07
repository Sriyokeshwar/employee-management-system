const employeeModel = require('../models/employeeModels');

function validateEmployee(body) {
    const reqBody = body || {};
    const fields = ['name', 'role', 'email', 'phone'];

    const missingField = fields.find(
        (field) => !String(reqBody[field] || '').trim()
    );

    return missingField
        ? `The ${missingField} field is required.`
        : null;
}


// Get All
async function getEmployees(req, res) {
    try {
        const employees = await employeeModel.getAllEmployees();

        res.json(employees);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to fetch employees.'
        });
    }
}


// Create
async function addEmployee(req, res) {

    const validationError = validateEmployee(req.body);

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    const { name, role, email, phone } = req.body;

    try {

        const newEmployee =
            await employeeModel.createEmployee(
                name.trim(),
                role.trim(),
                email.trim(),
                phone.trim()
            );

        res.status(201).json(newEmployee);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to create employee.'
        });
    }
}


// Update
async function editEmployee(req, res) {

    const validationError = validateEmployee(req.body);

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    const { name, role, email, phone } = req.body;

    try {

        const updatedEmployee =
            await employeeModel.updateEmployee(
                req.params.id,
                name.trim(),
                role.trim(),
                email.trim(),
                phone.trim()
            );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: 'Employee not found.'
            });
        }

        res.json(updatedEmployee);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to update employee.'
        });
    }
}


// Delete
async function removeEmployee(req, res) {

    try {

        const success =
            await employeeModel.deleteEmployee(
                req.params.id
            );

        if (!success) {
            return res.status(404).json({
                message: 'Employee not found.'
            });
        }

        res.status(204).send();

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to delete employee.'
        });
    }
}


module.exports = {
    getEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
};