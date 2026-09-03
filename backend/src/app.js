import cors from 'cors';
import express from 'express';

import { ComplaintRepository } from './features/submit-a-complaint/repositories/complaint-repository.js';
import { ComplaintService } from './features/submit-a-complaint/services/complaint-service.js';
import { ComplaintController } from './features/submit-a-complaint/controllers/complaint-controller.js';
import { createComplaintRoutes } from './features/submit-a-complaint/routes/complaint-routes.js';

/**
 * Creates and configures the Express application.
 *
 * Dependency injection is used here so that:
 * - the real database can be provided in production
 * - a mock database can be provided during integration testing
 *
 * @param {Object} options - Application configuration.
 * @param {Object} options.db - Database client.
 * @returns {Express} Configured Express application.
 */
const createApp = ({
  db = {
    /**
     * Temporary database implementation.
     *
     * This is only a placeholder until the actual database
     * connection is configured.
     */
    async execute() {
      throw new Error('Database is not configured yet.');
    },
  },
} = {}) => {
  const app = express();

  /**
   * Parse incoming JSON request bodies.
   *
   * Without this middleware, req.body would not contain
   * JSON data sent by the frontend or Supertest.
   */
  //Enable cors to relate to backend and frontend ports.
  app.use(cors());
  app.use(express.json());

  /**
   * Temporary authentication middleware.
   *
   * The actual project will later use the real authentication
   * middleware to identify the logged-in user.
   *
   * For now, this allows the complaint feature to receive
   * req.user during integration testing.
   */
  app.use((req, res, next) => {
    req.user = {
      id: 'PASSENGER-001',
      role: 'PASSENGER',
    };

    next();
  });

  /**
   * Create the complaint feature layers.
   *
   * Request flow:
   *
   * Route
   *   ↓
   * Controller
   *   ↓
   * Service
   *   ↓
   * Repository
   *   ↓
   * Database
   */
  const complaintRepository = new ComplaintRepository(db);

  const complaintService = new ComplaintService(
    complaintRepository,
  );

  const complaintController = new ComplaintController(
    complaintService,
  );

  /**
   * Register complaint-related API routes.
   *
   * All complaint endpoints will start with:
   * /api/complaints
   */
  app.use(
    '/api/complaints',
    createComplaintRoutes(complaintController),
  );

  return app;
};

/**
 * Default application instance.
 *
 * This instance is used when running the actual backend server.
 * At the moment it uses the temporary database implementation.
 */
const app = createApp();

/**
 * Export createApp so integration tests can inject
 * a mock database.
 */
export { createApp };

/**
 * Export the default Express application.
 */
export default app;