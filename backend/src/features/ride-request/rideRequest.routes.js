import { Router } from 'express';
import { requireLogin, requireRole } from '../../shared/middleware/requireLogin.js';
import { createRideRequest, getRouteOptions } from './rideRequest.controller.js';

/**
 * Ride request routes. Mounted in app.js under /api/ride-requests.
 */
const router = Router();

// GET /api/ride-requests/route-options → stops, fares, travel times for the form
router.get('/route-options', requireLogin, getRouteOptions);

// POST /api/ride-requests → save a request and assign a driver/vehicle
router.post('/', requireLogin, requireRole('Passenger'), createRideRequest);

export default router;
