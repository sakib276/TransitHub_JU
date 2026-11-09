import { useState } from "react";
import DriverRequestCard from "../components/DriverRequestCard";
import "../styles/driverRideRequests.css";

const initialRequests = [
  {
    id: 1,
    passenger: "Nafis",
    pickup: "JU Gate",
    destination: "Transport",
    seats: 2,
    time: "10:30 AM",
  },
  {
    id: 2,
    passenger: "Anika",
    pickup: "Medical",
    destination: "Bot Tala",
    seats: 1,
    time: "11:00 AM",
  },
  {
    id: 3,
    passenger: "Raiyan",
    pickup: "Shaheed Salam Hall",
    destination: "JU Gate",
    seats: 3,
    time: "11:20 AM",
  },
];

export default function DriverRideRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [availableSeats, setAvailableSeats] = useState(3);
  const [isOnline, setIsOnline] = useState(true);
  const [message, setMessage] = useState("");

  const handleAccept = (request) => {
    if (request.seats > availableSeats) {
      setMessage("Not enough seats available.");
      return;
    }

    setAvailableSeats((prev) => prev - request.seats);
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setMessage("Ride accepted. Passenger notified.");
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setMessage("Request rejected and sent to another driver.");
  };

  return (
    <div className="ride-layout">
      <header className="header-placeholder">Header</header>

      <div className="ride-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="ride-content">
          <div className="page-title">
            <h1>Driver Ride Requests</h1>
            <p>View and respond to passenger ride requests.</p>
          </div>

          <div className="driver-topbar">
            <div className="seat-badge">
              Available Seats: {availableSeats}
            </div>

            <button
              className={isOnline ? "online-btn" : "offline-btn"}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>

          {message && <div className="driver-message">{message}</div>}

          <div className="driver-list">
            {!isOnline ? (
              <div className="empty-card">
                You are offline. No new requests available.
              </div>
            ) : requests.length === 0 ? (
              <div className="empty-card">
                No pending ride requests.
              </div>
            ) : (
              requests.map((request) => (
                <DriverRequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleAccept(request)}
                  onReject={() => handleReject(request.id)}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}