import { Router } from 'express';
import { requireLogin, requireRole } from '../../shared/middleware/requireLogin.js';
import { getAssignedDriver } from './driverVehicle.controller.js';

/**
 * ROUTES = which URL runs which code.
 * Mounted in app.js under /api/driver-vehicle.
 *
 * A request passes through each function from left to right:
 *   requireLogin → requireRole('Passenger') → getAssignedDriver
 */
const router = Router();

// FR-11.1: GET /api/driver-vehicle/assigned-driver
router.get('/assigned-driver', requireLogin, requireRole('Passenger'), getAssignedDriver);

export default router;
