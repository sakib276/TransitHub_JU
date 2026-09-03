import PriorityRequest from "../models/PriorityRequest.js";
import QueueEntry from "../models/QueueEntry.js";

/**
 * Gets priority requests waiting for administrative review.
 * @returns {Promise<Array>} Pending priority requests.
 */
export const getPendingPriorityRequests = async () => {
  return PriorityRequest.findAll({
    where: { status: "Pending" },
    order: [["created_at", "ASC"]],
  });
};

/**
 * Changes a pending request's review status.
 * Approved requests are marked as priority in the queue.
 * @param {number|string} id Priority request ID.
 * @param {string} status Review status.
 * @param {string} reviewReason Optional administrative reason.
 * @returns {Promise<Object>} Updated priority request.
 */
const reviewPriorityRequest = async (id, status, reviewReason) => {
  const request = await PriorityRequest.findByPk(id);
  if (!request) throw new Error("Priority request not found.");
  if (request.status !== "Pending") throw new Error("Priority request was already reviewed.");

  request.status = status;
  request.review_reason = reviewReason || null;
  request.reviewed_at = new Date();
  await request.save();

  if (status === "Approved") {
    await QueueEntry.update(
      { priority: true },
      { where: { id: request.queue_entry_id } }
    );
  }

  return request;
};

/** Approves a pending priority request. */
export const approvePriorityRequest = (id, reason) =>
  reviewPriorityRequest(id, "Approved", reason);

/** Rejects a pending priority request. */
export const rejectPriorityRequest = (id, reason) =>
  reviewPriorityRequest(id, "Rejected", reason);

/**
 * Creates a pending priority request with its stored proof path.
 * @param {Object} data Priority request data.
 * @param {number|string} data.queue_entry_id Queue entry ID.
 * @param {number|string} data.passenger_id Passenger ID.
 * @param {string} data.reason Priority reason.
 * @param {string} data.proof_path Stored proof path.
 * @returns {Promise<Object>} Created priority request.
 */
export const submitPriorityRequest = async (data = {}) => {
  if (!data.queue_entry_id || !data.passenger_id || !data.reason || !data.proof_path) {
    throw new Error("Queue entry, passenger, reason, and proof are required.");
  }

  return PriorityRequest.create({
    queue_entry_id: data.queue_entry_id,
    passenger_id: data.passenger_id,
    reason: data.reason,
    proof_path: data.proof_path,
    status: "Pending",
  });
};