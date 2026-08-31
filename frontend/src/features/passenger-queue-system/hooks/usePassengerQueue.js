import { useState } from "react";
import {
  getQueueToken,
  validatePriorityRequest,
  validateQueueJoin,
} from "../services/queueService";

export default function usePassengerQueue() {
  const [queueEntry, setQueueEntry] = useState(null);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [message, setMessage] = useState("");

  const joinQueue = ({ pickup, destination, seats, gender, priority = false, queueOpen = true, vehicleAvailable = false }) => {
    const validation = validateQueueJoin({
      pickup,
      destination,
      seats,
      gender,
      queueOpen,
      alreadyQueued: Boolean(queueEntry),
    });
    if (validation !== "Valid") return setMessage(validation);

    if (vehicleAvailable) {
      setMessage("A vehicle is available now. You have been offered a ride directly.");
      return;
    }

    const position = 4;
    setQueueEntry({ pickup, destination, seats, gender, priority, position, token: getQueueToken(position), joinedAt: "Just now" });
    setMessage("You have joined the queue successfully.");
  };

  const submitPriorityRequest = ({ reason, proof, needsReview = true }) => {
    const validation = validatePriorityRequest({
      reason,
      proof,
      hasActiveRequest: priorityStatus === "Pending",
    });
    if (validation !== "Valid") return setMessage(validation);

    if (reason === "Other") {
      setPriorityStatus("Rejected");
      setMessage("Priority request rejected: the proof does not meet the emergency policy.");
      return;
    }

    if (needsReview) {
      setPriorityStatus("Pending");
      setMessage("Your priority request is pending administrator review.");
      return;
    }

    setPriorityStatus("Approved");
    setQueueEntry((entry) => (entry ? { ...entry, position: 1, token: getQueueToken(1) } : entry));
    setMessage("Priority approved. Your queue position has been updated.");
  };

  return { queueEntry, priorityStatus, message, setMessage, joinQueue, submitPriorityRequest };
}
