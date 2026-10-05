/**
 * This file Provides the connection pool for the TransitHub_JU backend for the Update Vechicle Status.
 * 
 * @module database
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Mysql connection pool used to communicate with the Transithub_Ju database.
 * 
 * @constant
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;