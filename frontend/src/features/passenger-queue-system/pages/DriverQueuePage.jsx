/**
 * Driver Queue page module.
 * @module DriverQueuePage
 */

import { useState } from "react";
import DriverQueueCard from "../components/DriverQueueCard";
import "../styles/driverQueue.css";

/**
 * Passenger waiting in the driver queue.
 *
 * @typedef {Object} QueuePassenger
 * @memberof module:DriverQueuePage
 * @property {number} id Unique passenger identifier.
 * @property {string} name Passenger name.
 * @property {string} token Queue token number.
 * @property {boolean} priority Whether the passenger has priority status.
 * @property {string} destination Passenger destination.
 * @property {number} seats Number of requested seats.
 * @property {string} gender Gender preference.
 */

/** @type {QueuePassenger[]} */
const initialPassengers = [
  {
    id: 1,
    name: "Anika",
    token: "JU-001",
    priority: true,
    destination: "Central Library",
    seats: 1,
    gender: "Female",
  },
  {
    id: 2,
    name: "Nafis",
    token: "JU-002",
    priority: false,
    destination: "Business Studies",
    seats: 2,
    gender: "Any",
  },
  {
    id: 3,
    name: "Sadia",
    token: "JU-003",
    priority: false,
    destination: "Transport",
    seats: 1,
    gender: "Female",
  },
];

/**
 * Driver Queue Page component.
 *
 * Allows drivers to manage passengers waiting at a pickup stand,
 * assign available seats, and mark passengers as no-shows.
 *
 * @memberof module:DriverQueuePage
 * @returns {JSX.Element} Driver queue management interface.
 */
export default function DriverQueuePage() {
  /** Current waiting passenger list. */
  const [passengers, setPassengers] = useState(initialPassengers);

  /** Number of available vehicle seats. */
  const [seats, setSeats] = useState(2);

  /** Feedback message displayed after queue actions. */
  const [message, setMessage] = useState("");

  /**
   * Removes a passenger from the queue and displays a notification.
   *
   * @param {number} id Passenger identifier.
   * @param {string} notice Status message to display.
   * @returns {void}
   */
  const removePassenger = (id, notice) => {
    setPassengers((items) => items.filter((item) => item.id !== id));
    setMessage(notice);
  };

  /**
   * Assigns seats to a passenger if enough seats are available.
   *
   * @param {QueuePassenger} passenger Passenger being assigned.
   * @returns {void}
   */
  const assignSeat = (passenger) => {
    if (seats < passenger.seats) {
      setMessage(
        `Only ${seats} seat${
          seats === 1 ? " is" : "s are"
        } available; ${passenger.name} requested ${passenger.seats}.`
      );
      return;
    }

    setSeats((value) => value - passenger.seats);

    removePassenger(
      passenger.id,
      `${passenger.name} has been assigned ${passenger.seats} seat${
        passenger.seats > 1 ? "s" : ""
      }.`
    );
  };

  return (
    <div className="queue-layout">
      <header className="header-placeholder">Header</header>

      <div className="queue-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="queue-content">
          <div className="queue-page-title">
            <h1>Driver Queue</h1>
            <p>Assign available seats fairly to passengers at your stand.</p>
          </div>

          <div className="driver-queue-toolbar">
            <div>
              <span>Pickup stand</span>
              <strong>JU Gate</strong>
            </div>

            <div className="seat-counter">
              Available seats: {seats}
            </div>
          </div>

          {message && <div className="queue-message">{message}</div>}

          <section className="driver-queue-list">
            {passengers.length ? (
              passengers.map((passenger) => (
                <DriverQueueCard
                  key={passenger.id}
                  passenger={passenger}
                  disabled={seats < passenger.seats}
                  onAssign={() => assignSeat(passenger)}
                  onNoShow={() =>
                    removePassenger(
                      passenger.id,
                      `${passenger.name} was marked as no-show. The next passenger may now board.`
                    )
                  }
                />
              ))
            ) : (
              <div className="queue-card queue-empty-state">
                No one is waiting at JU Gate.
              </div>
            )}
          </section>
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}