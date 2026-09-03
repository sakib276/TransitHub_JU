/**
 * @file Complaint Routes.
 *
 * The Route Layer defines the HTTP endpoints for the
 * Submit a Complaint feature.
 *
 * Responsibilities:
 * - Define HTTP methods and URL paths.
 * - Connect endpoints to controller methods.
 *
 * The Route Layer does NOT:
 * - Validate business rules.
 * - Access the database.
 * - Perform business logic.
 * - Handle complaint data directly.
 *
 * Request flow:
 *
 * Client
 *   ↓
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

import { Router } from 'express';

/**
 * Creates the complaint router.
 *
 * @param {Object} complaintController - Complaint controller dependency.
 * @returns {Router} Configured Express router.
 */
export function createComplaintRoutes(complaintController) {
  const router = Router();

  /**
   * POST /
   *
   * Creates a new complaint for the authenticated passenger.
   *
   * Controller:
   * complaintController.createComplaint
   */
  router.post(
    '/',
    complaintController.createComplaint,
  );

  /**
   * GET /
   *
   * Returns all complaints submitted by the
   * currently authenticated passenger.
   *
   * Controller:
   * complaintController.getPassengerComplaints
   */
  router.get(
    '/',
    complaintController.getPassengerComplaints,
  );

  /**
   * GET /all
   *
   * Returns all complaints in the system.
   *
   * Administrator authorization is handled
   * by the Service layer.
   *
   * Controller:
   * complaintController.getAllComplaints
   */
  router.get(
    '/all',
    complaintController.getAllComplaints,
  );

  /**
   * GET /:complaintId
   *
   * Returns a single complaint.
   *
   * Controller:
   * complaintController.getComplaintById
   */
  router.get(
    '/:complaintId',
    complaintController.getComplaintById,
  );

  /**
   * PATCH /:complaintId/status
   *
   * Updates the status of a complaint.
   *
   * Controller:
   * complaintController.updateComplaintStatus
   */
  router.patch(
    '/:complaintId/status',
    complaintController.updateComplaintStatus,
  );

  return router;
}