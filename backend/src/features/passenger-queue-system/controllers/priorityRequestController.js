import { submitPriorityRequest } from "../services/priorityRequestService.js";

export const createPriorityRequest = async (req, res) => {
  try {
    const request = await submitPriorityRequest(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};