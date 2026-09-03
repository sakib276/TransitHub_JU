
/**
 * Passenger Queue Service module.
 * @module queueService
 */

import QueueEntry from "../models/QueueEntry.js";
import QueueAssignment from "../models/QueueAssignment.js";
import PriorityRequest from "../models/PriorityRequest.js";

/**
 * Assigns a waiting passenger to a driver and vehicle.
 *
 * @param {number} queueId Queue entry ID.
 * @param {Object} data Assignment information.
 * @param {number} data.driver_id Driver ID.
 * @param {number} data.vehicle_id Vehicle ID.
 * @param {number} data.availableSeats Available vehicle seats.
 * @returns {Promise<Object>} Assignment result.
 */
export const assignPassenger = async (queueId, data) => {
  const passenger = await QueueEntry.findByPk(queueId);

  if (!passenger) {
    throw new Error("Passenger not found.");
  }

  if (passenger.status !== "Waiting") {
    throw new Error("Passenger is no longer waiting.");
  }

  if (data.availableSeats < passenger.seats_needed) {
    throw new Error(
      `Only ${data.availableSeats} seat${
        data.availableSeats === 1 ? " is" : "s are"
      } available; passenger requested ${passenger.seats_needed}.`
    );
  }

  passenger.status = "Assigned";

  await passenger.save();

  await QueueAssignment.create({
    queue_entry_id: passenger.id,
    driver_id: data.driver_id,
    vehicle_id: data.vehicle_id,
    seats_assigned: passenger.seats_needed,
  });

  await refreshQueue(passenger.pickup_location_id);

  return {
    message: "Passenger assigned successfully.",
    seatsUsed: passenger.seats_needed,
  };
};

/**
 * Marks a waiting passenger as a no-show.
 *
 * @param {number} queueId Queue entry ID.
 * @returns {Promise<Object>} No-show result.
 */
export const markNoShow = async (queueId) => {
  const passenger = await QueueEntry.findByPk(queueId);

  if (!passenger) {
    throw new Error("Passenger not found.");
  }

  if (passenger.status !== "Waiting") {
    throw new Error("Passenger is no longer waiting.");
  }

  passenger.status = "No-show";

  await passenger.save();

  await refreshQueue(passenger.pickup_location_id);

  return {
    message: "Passenger marked as no-show.",
  };
};

/**
 * Creates a priority request for a passenger.
 *
 * @param {Object} data Priority request information.
 * @param {number} data.queue_entry_id Queue entry ID.
 * @param {number} data.passenger_id Passenger ID.
 * @param {string} data.reason Emergency reason.
 * @param {Object} data.proof Uploaded proof file.
 * @returns {Promise<Object>} Priority request result.
 */
export const createPriorityRequest = async (data) => {
  const queueEntry = await QueueEntry.findByPk(
    data.queue_entry_id
  );

  if (!queueEntry) {
    throw new Error("Queue entry not found.");
  }

  if (queueEntry.passenger_id !== Number(data.passenger_id)) {
    throw new Error(
      "Passenger does not own this queue entry."
    );
  }

  if (queueEntry.status !== "Waiting") {
    throw new Error(
      "Priority request can only be submitted while waiting."
    );
  }

  if (!data.reason) {
    throw new Error("Priority reason is required.");
  }

  if (!data.proof) {
    throw new Error("Supporting proof is required.");
  }

  const existingRequest = await PriorityRequest.findOne({
    where: {
      queue_entry_id: data.queue_entry_id,
      status: "Pending",
    },
  });

  if (existingRequest) {
    throw new Error(
      "A priority request is already pending for this queue entry."
    );
  }

  const proofPath = data.proof.path;

  const priorityRequest = await PriorityRequest.create({
    queue_entry_id: data.queue_entry_id,
    passenger_id: data.passenger_id,
    reason: data.reason,
    proof: proofPath,
    status: "Pending",
  });

  return {
    message: "Priority request submitted for review.",
    status: priorityRequest.status,
    priorityRequest,
  };
};

/**
 * Recalculates queue positions.
 *
 * Priority passengers are placed first, followed by
 * passengers ordered by join time.
 *
 * @param {number} pickupId Pickup location ID.
 * @returns {Promise<void>}
 */
const refreshQueue = async (pickupId) => {
  const waiting = await QueueEntry.findAll({
    where: {
      pickup_location_id: pickupId,
      status: "Waiting",
    },
    order: [
      ["priority", "DESC"],
      ["joined_at", "ASC"],
    ],
  });

  for (let i = 0; i < waiting.length; i += 1) {
    waiting[i].position = i + 1;
    await waiting[i].save();
  }
};
