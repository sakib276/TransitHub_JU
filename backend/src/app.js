/**
 * Configures and exports the Express application.
 * 
 * @module app
 */

import express from 'express';
import cors from 'cors';

const app = express();

//Global Middleware

app.use(cors());
app.use(express.json());

/**
 * Checks whether the TransitHub API is running .
 * 
 * @route GET /api/health
 */

app.get('/api/health',(req,res)=>{
    res.status(200).json({
        status: 'OK',
        message: 'TransitHub API is running',
    });
});

/**
 * Handles application errors centrally.
 * 
 * @param {Error} err - The error object..
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
app.use((err,req,res, next) => {
 console.error(err.stack);

    res.status(err.status || 500 ).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

export default app;