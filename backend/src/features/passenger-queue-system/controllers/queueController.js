
/**
 * Passenger Queue Controller module.
 * @module queueController
 */

import * as queueService from "../services/queueService.js";

/**
 * Creates a passenger queue entry.
 *
 * @param {Object} req Express request.
 * @param {Object} res Express response.
 */
export const joinQueue = async (req, res) => {
  try {
    const result = await queueService.joinQueue(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * Gets the waiting queue for a pickup location.
 *
 * @param {Object} req Express request.
 * @param {Object} res Express response.
 */
export const getQueue = async (req, res) => {
  try {
    const result = await queueService.getQueue(
      req.params.pickupId
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * Assigns a passenger to a driver and vehicle.
 *
 * @param {Object} req Express request.
 * @param {Object} res Express response.
 */
export const assignPassenger = async (req, res) => {
  try {
    const result = await queueService.assignPassenger(
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * Marks a passenger as a no-show.
 *
 * @param {Object} req Express request.
 * @param {Object} res Express response.
 */
export const markNoShow = async (req, res) => {
  try {
    const result = await queueService.markNoShow(
      req.params.id
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * Creates a priority request.
 *
 * The route should use multer before this controller
 * so that the uploaded proof file is available as
 * req.file.
 *
 * @param {Object} req Express request.
 * @param {Object} res Express response.
 */
export const createPriorityRequest = async (req, res) => {
  try {
    const result = await queueService.createPriorityRequest({
      queue_entry_id: req.body.queue_entry_id,
      passenger_id: req.body.passenger_id,
      reason: req.body.reason,
      proof: req.file,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
