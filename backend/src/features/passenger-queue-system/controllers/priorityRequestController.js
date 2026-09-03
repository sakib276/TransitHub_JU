import {
  approvePriorityRequest,
  getPendingPriorityRequests,
  rejectPriorityRequest,
  submitPriorityRequest,
} from "../services/priorityRequestService.js";

/**
 * Creates a priority request from multipart form data.
 * @param {Object} req Express request containing body fields and proof file.
 * @param {Object} res Express response.
 * @returns {Promise<void>}
 */
export const createPriorityRequest = async (req, res) => {
  try {
    const request = await submitPriorityRequest({
      ...(req.body || {}),
      proof_path: req.file
        ? `/uploads/priority-proofs/${req.file.filename}`
        : req.body?.proof_path,
    });
    res.status(201).json({ message: "Priority request submitted for review.", status: request.status, priorityRequest: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Returns all priority requests awaiting administrative review.
 * @param {Object} _req Express request.
 * @param {Object} res Express response.
 * @returns {Promise<void>}
 */
export const listPendingPriorityRequests = async (_req, res) => {
  try {
    res.json(await getPendingPriorityRequests());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Approves a pending priority request and promotes its queue entry.
 * @param {Object} req Express request containing the request ID.
 * @param {Object} res Express response.
 * @returns {Promise<void>}
 */
export const approveRequest = async (req, res) => {
  try {
    res.json(await approvePriorityRequest(req.params.id, req.body.review_reason));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Rejects a pending priority request.
 * @param {Object} req Express request containing the request ID and reason.
 * @param {Object} res Express response.
 * @returns {Promise<void>}
 */
export const rejectRequest = async (req, res) => {
  try {
    res.json(await rejectPriorityRequest(req.params.id, req.body.review_reason));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};