import { useState } from "react";
import RideForm from "../components/RideForm";
import RideRequestCard from "../components/RideRequestCard";
import RequestStatus from "../components/RequestStatus";
import "../styles/rideRequest.css";

export default function RideRequestPage() {
  // Get current date and time
  const now = new Date();

  const currentDate = now.toISOString().split("T")[0];

  const currentTime = now.toTimeString().slice(0, 5);

  const [rideData, setRideData] = useState({
    pickup: "",
    destination: "",
    date: currentDate,
    time: currentTime,
    seats: 2,
    gender: "",
    rideType: "shared",
    notes: "",
    fare: 0,
    travelTime: 0,
  });

  // Stores the submitted request
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleSubmit = () => {
    // Basic validation
    if (!rideData.pickup || !rideData.destination) {
      alert("Please select pickup and destination.");
      return;
    }

    if (rideData.pickup === rideData.destination) {
      alert("Pickup and destination cannot be the same.");
      return;
    }

    if (!rideData.date || !rideData.time) {
      alert("Please select date and time.");
      return;
    }

    // Save the submitted request
    setSubmittedRequest({
      ...rideData,
      status: "Searching",
    });
  };

  const handleCancel = () => {
    setRideData({
      pickup: "",
      destination: "",
      date: currentDate,
      time: currentTime,
      seats: 2,
      gender: "",
      rideType: "shared",
      notes: "",
      fare: 0,
      travelTime: 0,
    });

    setSubmittedRequest(null);
  };

  return (
    <div className="ride-layout">
      <header className="header-placeholder">
        Header
      </header>

      <div className="ride-body">
        <aside className="sidebar-placeholder">
          Sidebar
        </aside>

        <main className="ride-content">
          <div className="page-title">
            <h1>Ride Request</h1>
            <p>
              Configure and request a ride across the JU campus network.
            </p>
          </div>

          <div className="ride-grid">

            <RideForm
              rideData={rideData}
              setRideData={setRideData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />

            <div className="right-column">

              <RideRequestCard
                rideData={
                  submittedRequest || rideData
                }
              />

              <RequestStatus
                submittedRequest={submittedRequest}
              />

            </div>
          </div>
        </main>
      </div>

      <footer className="footer-placeholder">
        Footer
      </footer>
    </div>
  );
}