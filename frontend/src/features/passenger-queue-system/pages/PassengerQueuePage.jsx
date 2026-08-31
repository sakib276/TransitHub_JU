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
 * Passenger Queue Page component.
 *
 * Allows passengers to join a vehicle queue, monitor their
 * current queue status, and submit a priority request.
 *
 * @memberof module:PassengerQueuePage
 * @returns {JSX.Element} Passenger queue interface.
 */
export default function PassengerQueuePage() {
  /** Selected pickup location. */
  const [pickup, setPickup] = useState("");

  /** Selected destination. */
  const [destination, setDestination] = useState("");

  /** Number of requested seats. */
  const [seats, setSeats] = useState(1);

  /** Passenger gender preference. */
  const [gender, setGender] = useState("Any");

  /** Indicates whether the passenger requests priority. */
  const [priority, setPriority] = useState(false);

  /**
   * Queue management state and actions provided by the custom hook.
   */
  const {
    queueEntry,
    priorityStatus,
    message,
    joinQueue,
    submitPriorityRequest,
  } = usePassengerQueue();

  return (
    <div className="queue-layout">
      <header className="header-placeholder">Header</header>

      <div className="queue-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="queue-content">
          <div className="queue-page-title">
            <h1>Passenger Queue</h1>
            <p>Keep your place in line when vehicles are busy.</p>
          </div>

          {message && <div className="queue-message">{message}</div>}

          <div className="passenger-queue-grid">
            <div>
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
                onJoin={() =>
                  joinQueue({
                    pickup,
                    destination,
                    seats,
                    gender,
                    priority,
                  })
                }
                disabled={Boolean(queueEntry)}
              />

              <PriorityRequestForm
                onSubmit={submitPriorityRequest}
                status={priorityStatus}
              />
            </div>

            <QueueStatusCard
              entry={queueEntry}
              priorityStatus={priorityStatus}
            />
          </div>
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}