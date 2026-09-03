
/**
 * Passenger Queue page module.
 * @module PassengerQueuePage
 */

import { useState } from "react";
import QueueJoinForm from "../components/QueueJoinForm";
import QueueStatusCard from "../components/QueueStatusCard";
import PriorityRequestForm from "../components/PriorityRequestForm";
import usePassengerQueue from "../hooks/usePassengerQueue";
import "../styles/passengerQueue.css";

/**
 * Displays the passenger queue page.
 *
 * @returns {JSX.Element} Passenger queue page.
 */
export default function PassengerQueuePage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState(1);
  const [gender, setGender] = useState("Any");
  const [priority, setPriority] = useState(false);

  /*
   * Temporary passenger ID.
   *
   * Replace this with the authenticated user's ID
   * when authentication is connected.
   */
  const passengerId = 1;

  const {
    queueEntry,
    priorityStatus,
    message,
    joinQueue,
    submitPriorityRequest,
  } = usePassengerQueue();

  /**
   * Handles joining the queue.
   */
  const handleJoinQueue = async () => {
    if (!pickup || !destination) {
      return;
    }

    if (pickup === destination) {
      return;
    }

    try {
      await joinQueue({
        passenger_id: passengerId,
        pickup_location_id: Number(pickup),
        destination_location_id: Number(destination),
        seats_needed: seats,
        gender_preference: gender,
        priority,
      });
    } catch {
      // Error is already handled by the hook.
    }
  };

  /**
   * Handles priority request submission.
   *
   * @param {Object} data Priority request information.
   */
  const handlePriorityRequest = async (data) => {
    if (!queueEntry) {
      return;
    }

    try {
      await submitPriorityRequest({
        ...data,
        passenger_id: passengerId,
      });
    } catch {
      // Error is already handled by the hook.
    }
  };

  return (
    <div className="queue-layout">
      <header className="header-placeholder">Header</header>

      <div className="queue-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="queue-content">
          <div className="queue-page-title">
            <h1>Passenger Queue</h1>
            <p>
              Join the waiting queue when no vehicle is currently available.
            </p>
          </div>

          {message && (
            <div className="queue-message" role="alert">
              {message}
            </div>
          )}

          <QueueJoinForm
            pickup={pickup}
            setPickup={setPickup}
            destination={destination}
            setDestination={setDestination}
            seats={seats}
            setSeats={setSeats}
            gender={gender}
            setGender={setGender}
            priority={priority}
            setPriority={setPriority}
            onJoin={handleJoinQueue}
            disabled={Boolean(queueEntry)}
          />

          <QueueStatusCard
            entry={queueEntry}
            priorityStatus={priorityStatus}
          />

          {queueEntry && (
            <PriorityRequestForm
              onSubmit={handlePriorityRequest}
              status={priorityStatus}
            />
          )}
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}
