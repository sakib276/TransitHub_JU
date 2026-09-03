import PriorityRequest from "../models/PriorityRequest.js";
import QueueEntry from "../models/QueueEntry.js";

export const getPendingPriorityRequests = async () => {
  return PriorityRequest.findAll({
    where: { status: "Pending" },
    order: [["created_at", "ASC"]],
  });
};

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

export const approvePriorityRequest = (id, reason) =>
  reviewPriorityRequest(id, "Approved", reason);

export const rejectPriorityRequest = (id, reason) =>
  reviewPriorityRequest(id, "Rejected", reason);

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