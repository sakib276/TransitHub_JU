/**
 * @file availableVehicles.controller.js
 * @description Controller handling HTTP requests for available vehicles.
 */

import { getAvailableVehiclesFromDB } from './availableVehicles.service.js';

/**
 * Handles GET request to fetch available vehicles.
 * @async
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export async function getAvailableVehicles(req, res) {
  try {
    const vehicles = await getAvailableVehiclesFromDB();

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve available vehicles',
      error: error.message,
    });
  }
}