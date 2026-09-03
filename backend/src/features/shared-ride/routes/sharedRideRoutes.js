/**
 * @fileoverview Express Router for Shared Ride endpoints (FR-6).
 * @module features/shared-ride/routes/sharedRideRoutes
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/sharedRideController');

// Passenger endpoints (FR-6.1 & FR-6.2)
router.get('/', controller.getRides);
router.post('/', controller.createRide);
router.post('/:id/join', controller.joinRide);
router.post('/:id/cancel-booking', controller.cancelBooking);
router.post('/review', controller.submitReview);

// Driver endpoints (FR-6.3)
router.post('/:id/driver-response', controller.driverResponse);
router.post('/:id/no-show', controller.handleNoShow);

// System/Admin endpoints (FR-6.4)
router.get('/analytics', controller.getAnalytics);

module.exports = router;