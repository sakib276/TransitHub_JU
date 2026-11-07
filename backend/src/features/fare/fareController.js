/**
 * @fileoverview Controller handlers for fare calculation and complaint reporting.
 * @module features/fare/fareController
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import { fareModel } from './fareModel.js';

export const fareController = {
  /**
   * Returns list of all predefined campus fare routes.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  getPredefinedFares: async (req, res) => {
    try {
      const fares = await fareModel.getAllFares();
      return res.status(200).json({
        success: true,
        data: fares
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve fares.',
        error: error.message
      });
    }
  },

  /**
   * Calculates official fares for a specified pickup and destination.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  calculateRouteFare: async (req, res) => {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          message: 'Both pickup (from) and destination (to) queries are required.'
        });
      }

      if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Pickup and destination cannot be the same location.'
        });
      }

      const fareDetails = await fareModel.findFareByRoute(from, to);

      if (!fareDetails) {
        return res.status(404).json({
          success: false,
          message: 'No predefined fare chart found for this route.'
        });
      }

      return res.status(200).json({
        success: true,
        data: fareDetails
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error occurred while calculating route fare.',
        error: error.message
      });
    }
  },

  /**
   * Submits a passenger overcharge complaint report.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  submitOverchargeReport: async (req, res) => {
    try {
      const { pickup, destination, vehicleType, demandedFare, officialFare, vehicleNumber, comment } = req.body;

      if (!pickup || !destination || !vehicleType || !demandedFare) {
        return res.status(400).json({
          success: false,
          message: 'Required fields missing: pickup, destination, vehicleType, and demandedFare.'
        });
      }

      const createdReport = await fareModel.createOverchargeReport({
        pickup,
        destination,
        vehicleType,
        demandedFare,
        officialFare,
        vehicleNumber,
        comment
      });

      return res.status(201).json({
        success: true,
        message: 'Overcharge complaint recorded successfully.',
        data: createdReport
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to record overcharge report.',
        error: error.message
      });
    }
  }
};

export default fareController;