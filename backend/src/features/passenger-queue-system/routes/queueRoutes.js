
/**
 * Passenger Queue Routes module.
 * @module queueRoutes
 */

import express from "express";

import {
  joinQueue,
  getQueue,
  assignPassenger,
  markNoShow,
  createPriorityRequest,
} from "../controllers/queueController.js";

const router = express.Router();

/**
 * Join the passenger waiting queue.
 */
router.post("/", joinQueue);

/**
 * Get the waiting queue for a pickup location.
 */
router.get("/:pickupId", getQueue);

/**
 * Submit a priority request.
 *
 * Uses multipart/form-data because the request
 * contains a supporting proof file.
 */
router.post("/priority", createPriorityRequest);

/**
 * Assign a passenger to a vehicle.
 */
router.patch("/:id/assign", assignPassenger);

/**
 * Mark a passenger as a no-show.
 */
router.patch("/:id/no-show", markNoShow);

export default router;
