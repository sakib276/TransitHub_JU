/**
 * Queue Administration page module.
 * @module AdminQueuePage
 */

import { useMemo, useState } from "react";
import AdminQueueTable from "../components/AdminQueueTable";
import "../styles/adminQueue.css";

/**
 * Passenger queue record.
 *
 * @typedef {Object} QueuePassenger
 * @memberof module:AdminQueuePage
 * @property {number} id Unique passenger identifier.
 * @property {string} token Queue token number.
 * @property {string} name Passenger name.
 * @property {boolean} priority Indicates whether the passenger has priority.
 * @property {string} pickup Passenger pickup location.
 * @property {string} destination Passenger destination.
 * @property {number} seats Number of requested seats.
 * @property {string} gender Gender preference.
 */

/** @type {QueuePassenger[]} */
const initialQueue = [
  {
    id: 1,
    token: "JU-001",
    name: "Anika",
    priority: true,
    pickup: "JU Gate",
    destination: "Central Library",
    seats: 1,
    gender: "Female",
  },
  {
    id: 2,
    token: "JU-002",
    name: "Nafis",
    priority: false,
    pickup: "JU Gate",
    destination: "Business Studies",
    seats: 2,
    gender: "Any",
  },
  {
    id: 3,
    token: "ME-001",
    name: "Raiyan",
    priority: false,
    pickup: "Medical",
    destination: "Transport",
    seats: 1,
    gender: "Male",
  },
];

/**
 * Admin Queue Page component.
 *
 * Enables administrators to monitor waiting passengers,
 * assign seats manually, and perform automatic seat
 * allocation based on queue order and priority.
 *
 * @memberof module:AdminQueuePage
 * @returns {JSX.Element} Queue administration page.
 */
export default function AdminQueuePage() {
  /** Selected pickup point. */
  const [pickup, setPickup] = useState("JU Gate");

  /** Available seats in the incoming vehicle. */
  const [seats, setSeats] = useState(2);

  /** Current passenger queue. */
  const [queue, setQueue] = useState(initialQueue);

  /** Status message displayed after queue operations. */
  const [message, setMessage] = useState("");

  /**
   * Filtered passenger list for the selected pickup point.
   * Priority passengers are displayed before regular passengers.
   *
   * @type {QueuePassenger[]}
   */
  const passengers = useMemo(
    () =>
      queue
        .filter((item) => item.pickup === pickup)
        .sort((a, b) => Number(b.priority) - Number(a.priority)),
    [queue, pickup]
  );

  /**
   * Assigns seats to a selected passenger.
   *
   * Removes the passenger from the queue, updates the
   * remaining seat count, and refreshes queue positions.
   *
   * @param {number} id Passenger identifier.
   * @returns {void}
   */
  const assign = (id) => {
    const passenger = queue.find((item) => item.id === id);

    if (!passenger || seats < passenger.seats) {
      setMessage(
        "There are not enough available seats for this passenger's request."
      );
      return;
    }

    setQueue((items) => items.filter((item) => item.id !== id));
    setSeats((value) => value - passenger.seats);

    setMessage(
      `${passenger.seats} seat${
        passenger.seats > 1 ? "s" : ""
      } assigned and queue positions refreshed.`
    );
  };

  /**
   * Automatically assigns seats based on queue order.
   *
   * Passengers are assigned only if their requested seats
   * fit within the remaining vehicle capacity.
   *
   * @returns {void}
   */
  const autoAssign = () => {
    let remainingSeats = seats;

    const assigned = passengers.filter((passenger) => {
      if (passenger.seats > remainingSeats) return false;

      remainingSeats -= passenger.seats;
      return true;
    });

    if (!assigned.length) {
      setMessage(
        "No waiting passenger's seat request fits the available seats."
      );
      return;
    }

    const ids = assigned.map((item) => item.id);

    setQueue((items) => items.filter((item) => !ids.includes(item.id)));

    setMessage(
      `${seats - remainingSeats} seat${
        seats - remainingSeats > 1 ? "s" : ""
      } assigned automatically by queue order.`
    );

    setSeats(remainingSeats);
  };

  return (
    <div className="queue-layout">
      <header className="header-placeholder">Header</header>

      <div className="queue-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="queue-content">
          <div className="queue-page-title">
            <h1>Queue Administration</h1>
            <p>
              Manage first-come, first-served queues and automatic seat
              assignment.
            </p>
          </div>

          <section className="queue-card admin-controls">
            <div className="queue-form-group">
              <label htmlFor="admin-pickup">Pickup point</label>
              <select
                id="admin-pickup"
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
              >
                <option>JU Gate</option>
                <option>Medical</option>
              </select>
            </div>

            <div className="queue-form-group">
              <label htmlFor="seat-count">Incoming vehicle seats</label>
              <input
                id="seat-count"
                type="number"
                min="0"
                value={seats}
                onChange={(event) => setSeats(Number(event.target.value))}
              />
            </div>

            <button
              className="queue-primary-btn"
              onClick={autoAssign}
            >
              Assign seats automatically
            </button>
          </section>

          {message && <div className="queue-message">{message}</div>}

          <AdminQueueTable
            passengers={passengers}
            onAssign={assign}
          />
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}