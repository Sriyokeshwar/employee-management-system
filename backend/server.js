require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const pool = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const port = Number(process.env.PORT) || 5000;

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman) or matching origin
        if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// API Health Check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        return res.status(200).json({
            success: true,
            status: 'ok',
            database: 'connected',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return res.status(503).json({
            success: false,
            status: 'error',
            database: 'disconnected',
            message: 'Database unavailable.',
            timestamp: new Date().toISOString(),
        });
    }
});

// Employee Routes
app.use('/api/employees', employeeRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Employee API running at http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
});

module.exports = app;