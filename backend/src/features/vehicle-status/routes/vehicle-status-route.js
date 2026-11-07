/**
 * Express router for vehicle status endpoints.
 * 
 * @module vehicle-status-route
 */
import { Router } from 'express';
import vehicleStatusController from '../controllers/vehicle-status-controller.js';
const router = Router();
router.get('/driver/status', vehicleStatusController.getStatus);
router.put('/driver/status', vehicleStatusController.updateStatus);
router.get('/locations', vehicleStatusController.getLocations);
export default router;