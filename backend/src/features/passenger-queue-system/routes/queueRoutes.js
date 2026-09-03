/**
 * Passenger Queue Routes module.
 * @module queueRoutes
 */

import express from "express";
import upload from "../../../middleware/upload.js";

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
 * Submit a priority request.
 *
 * Currently accepts proof_path as a normal request-body value.
 */
router.post("/priority", upload.single("proof"), createPriorityRequest);

/**
 * Get the waiting queue for a pickup location.
 */
router.get("/:pickupId", getQueue);

/**
 * Assign a passenger to a vehicle.
 */
router.patch("/:id/assign", assignPassenger);

/**
 * Mark a passenger as a no-show.
 */
router.patch("/:id/no-show", markNoShow);

export default router;