/**
 * Starts the TransitHub_JU backend server.
 * 
 * 
 * @module server
 */

import app from './app.js';
import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Verifies the database conncection and starts the server.
 * 
 * @returns {promise<void>} Resolves when the server is started.
 */

async function startServer() {
    try {
        //verify database connection on startup 
        const connection = await pool.getConnection();


        console.log('Connected to MYSQL database successfully');

        connection.release();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.error('Failed to connect to database:',error.message);
        process.exit(1);
    }
}

startServer();