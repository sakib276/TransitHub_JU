
/**
 * Driver Queue page module.
 * @module DriverQueuePage
 */

import { useEffect, useState } from "react";
import DriverQueueCard from "../components/DriverQueueCard";
import {
  getQueue,
  assignPassenger,
  markNoShow,
} from "../services/queueService";
import "../styles/driverQueue.css";

/**
 * Displays the queue for the driver's pickup stand.
 *
 * @returns {JSX.Element} Driver queue page.
 */
export default function DriverQueuePage() {
  const [passengers, setPassengers] = useState([]);
  const [seats, setSeats] = useState(2);
  const [message, setMessage] = useState("");

  /*
   * Temporary values.
   *
   * These should come from the authenticated driver
   * and assigned vehicle once authentication/vehicle
   * assignment is connected.
   */
  const pickupLocationId = 1;
  const driverId = 2;
  const vehicleId = 1;

  /**
   * Loads the current waiting queue.
   */
  const loadQueue = async () => {
    try {
      const data = await getQueue(pickupLocationId);
      setPassengers(Array.isArray(data) ? data : data.queue || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  /**
   * Assigns a passenger to the current vehicle.
   *
   * @param {Object} passenger Queue entry.
   */
  const handleAssign = async (passenger) => {
    try {
      /*
       * Refresh the queue immediately before assignment
       * to reduce the chance of using stale queue data.
       */
      await loadQueue();

      const result = await assignPassenger(passenger.id, {
        driver_id: driverId,
        vehicle_id: vehicleId,
        availableSeats: seats,
      });

      setSeats((previousSeats) => previousSeats - result.seatsUsed);
      setMessage(result.message);

      await loadQueue();
    } catch (error) {
      setMessage(error.message);
    }
  };

  /**
   * Marks a passenger as a no-show.
   *
   * @param {Object} passenger Queue entry.
   */
  const handleNoShow = async (passenger) => {
    try {
      const result = await markNoShow(passenger.id);

      setMessage(result.message);

      await loadQueue();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="queue-layout">
      <header className="header-placeholder">Header</header>

      <div className="queue-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="queue-content">
          <div className="queue-page-title">
            <h1>Driver Queue</h1>

            <p>
              Assign available seats fairly to passengers at your stand.
            </p>
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

          {message && (
            <div className="queue-message" role="alert">
              {message}
            </div>
          )}

          <section className="driver-queue-list">
            {passengers.length > 0 ? (
              passengers.map((passenger) => (
                <DriverQueueCard
                  key={passenger.id}
                  passenger={{
                    id: passenger.id,
                    name:
                      passenger.passenger_name ||
                      `Passenger ${passenger.passenger_id}`,
                    token: passenger.token,
                    priority: Boolean(passenger.priority),
                    destination:
                      passenger.destination_name ||
                      passenger.destination ||
                      "Unknown",
                    seats: passenger.seats_needed,
                    gender:
                      passenger.gender_preference || "Any",
                  }}
                  disabled={seats < passenger.seats_needed}
                  onAssign={() => handleAssign(passenger)}
                  onNoShow={() => handleNoShow(passenger)}
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