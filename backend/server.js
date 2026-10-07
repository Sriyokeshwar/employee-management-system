require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./config/db');

const employeeRoutes = require('./routes/employeeRoutes');


const app = express();

const port = Number(process.env.PORT) || 5000;


// Middlewares

app.use(cors());

app.use(express.json());


// Health Check Route

app.get('/api/health', async (request, response) => {

    try {

        await pool.query('SELECT 1');

        response.json({
            status: 'ok',
            database: 'connected'
        });

    } catch (error) {

        response.status(503).json({
            status: 'error',
            message: 'Database unavailable.'
        });

    }

});


// Employee Routes-ah connect seiyathu

app.use(
    '/api/employees',
    employeeRoutes
);


// Server Listen

app.listen(port, () => {

    console.log(
        `Employee API running at http://localhost:${port}`
    );

});