/**
 * @file availableVehicles.routes.js
 * @description Routes definition for viewing available vehicles.
 */

import { Router } from 'express';
import { getAvailableVehicles } from './availableVehicles.controller.js';

const router = Router();

/**
 * Route: GET /api/vehicles/available
 */
router.get('/available', getAvailableVehicles);

export default router;