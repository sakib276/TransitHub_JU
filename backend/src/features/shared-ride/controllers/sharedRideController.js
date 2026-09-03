/**
 * @fileoverview Controller for handling Shared Ride HTTP endpoints.
 * @module features/shared-ride/controllers/sharedRideController
 */

const sharedRideService = require('../services/sharedRideService');

const sharedRideController = {
  getRides(req, res) {
    try {
      const { pickup, destination } = req.query;
      const data = sharedRideService.listRides(pickup, destination);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createRide(req, res) {
    try {
      const { pickupLocation, destinationLocation } = req.body;
      if (!pickupLocation || !destinationLocation) {
        return res.status(400).json({ success: false, message: 'Pickup and destination are required.' });
      }
      const newRide = sharedRideService.createRide(req.body);
      return res.status(201).json({ success: true, data: newRide, message: 'Shared ride created successfully' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  joinRide(req, res) {
    try {
      const { id } = req.params;
      const { passengerName } = req.body;
      const updated = sharedRideService.joinRide(id, passengerName || 'Nazmus Sakib');
      return res.status(200).json({ success: true, data: updated, message: 'Successfully joined shared ride' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const { passengerName } = req.body;
      const updated = sharedRideService.cancelBooking(id, passengerName || 'Nazmus Sakib');
      return res.status(200).json({ success: true, data: updated, message: 'Seat booking cancelled' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  handleNoShow(req, res) {
    try {
      const { id } = req.params;
      const { passengerId } = req.body;
      const updated = sharedRideService.handleNoShow(id, passengerId);
      return res.status(200).json({ success: true, data: updated, message: 'Passenger marked as no-show' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  driverResponse(req, res) {
    try {
      const { id } = req.params;
      const { action, driverName } = req.body;
      const updated = sharedRideService.driverResponse(id, action, driverName);
      return res.status(200).json({ success: true, data: updated, message: `Ride ${action.toLowerCase()}` });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  submitReview(req, res) {
    try {
      const review = sharedRideService.submitReview(req.body);
      return res.status(201).json({ success: true, data: review, message: 'Feedback submitted' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  getAnalytics(req, res) {
    try {
      const data = sharedRideService.getAnalytics();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = sharedRideController;