import {
  approvePriorityRequest,
  getPendingPriorityRequests,
  rejectPriorityRequest,
  submitPriorityRequest,
} from "../services/priorityRequestService.js";

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

export const listPendingPriorityRequests = async (_req, res) => {
  try {
    res.json(await getPendingPriorityRequests());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    res.json(await approvePriorityRequest(req.params.id, req.body.review_reason));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    res.json(await rejectPriorityRequest(req.params.id, req.body.review_reason));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};