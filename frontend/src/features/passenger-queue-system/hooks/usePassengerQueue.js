
/**
 * Passenger Queue Hook module.
 * @module usePassengerQueue
 */

import { useState } from "react";
import {
  joinQueue as joinQueueApi,
  submitPriorityRequest as submitPriorityRequestApi,
} from "../services/queueService";

/**
 * Provides passenger queue operations and state.
 *
 * @returns {Object} Queue state and actions.
 */
export default function usePassengerQueue() {
  const [queueEntry, setQueueEntry] = useState(null);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [message, setMessage] = useState("");

  /**
   * Adds the passenger to the waiting queue.
   *
   * @param {Object} data Queue information.
   * @returns {Promise<Object>} Created queue entry.
   */
  const joinQueue = async (data) => {
    try {
      setMessage("");

      const result = await joinQueueApi(data);

      setQueueEntry(result.queueEntry || result);
      setMessage(result.message || "Successfully joined the queue.");

      return result;
    } catch (error) {
      setMessage(error.message);
      throw error;
    }
  };

  /**
   * Submits a priority request.
   *
   * @param {Object} data Priority request information.
   * @returns {Promise<Object>} Priority request result.
   */
  const submitPriorityRequest = async (data = {}) => {
    try {
      setMessage("");

      if (!queueEntry?.id) {
        throw new Error("Join the queue before submitting a priority request.");
      }

      const result = await submitPriorityRequestApi({
        ...data,
        queue_entry_id: queueEntry?.id,
      });

      setPriorityStatus(result.status || "Pending");
      setMessage(
        result.message || "Priority request submitted for review."
      );

      return result;
    } catch (error) {
      setMessage(error.message);
      throw error;
    }
  };

  return {
    queueEntry,
    priorityStatus,
    message,
    joinQueue,
    submitPriorityRequest,
  };
}

