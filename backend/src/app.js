/**
 * @fileoverview Express application configuration and route registration.
 * @module app
 */

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { fareRoutes } from './features/fare/index.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger (OpenAPI 3.0) Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TransitHubJU API',
      version: '1.0.0',
      description: 'API documentation for TransitHubJU campus transit system'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ]
  },
  apis: ['./src/features/**/*.js', './src/app.js']
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount Feature Routes
app.use('/api/fares', fareRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TransitHubJU backend is active' });
});

export default app;