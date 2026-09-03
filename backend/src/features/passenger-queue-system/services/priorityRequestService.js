import PriorityRequest from "../models/priorityRequest.js";

export const submitPriorityRequest = async (data) => {
  return PriorityRequest.create({
    ...data,
    status: "Pending",
  });
};