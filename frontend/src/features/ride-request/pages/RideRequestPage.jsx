import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRideRequest, getRouteOptions } from "../services/rideRequestApi";
import RideForm from "../components/RideForm";
import RideRequestCard from "../components/RideRequestCard";
import RequestStatus from "../components/RequestStatus";
import "../styles/rideRequest.css";

export default function RideRequestPage() {
  const navigate = useNavigate();

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

  // Pickup → destination pairs (with fare and time) from the database
  const [routeOptions, setRouteOptions] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getRouteOptions()
      .then(setRouteOptions)
      .catch((error) => setLoadError(error.message));
  }, []);

  const handleSubmit = async () => {
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

    // Show "Searching" while the request is being saved
    setSubmittedRequest({
      ...rideData,
      status: "Searching",
    });

    try {
      // Save to the database; the backend assigns a driver and vehicle
      await createRideRequest({
        pickupStop: rideData.pickup,
        dropStop: rideData.destination,
      });
    } catch (error) {
      setSubmittedRequest(null);
      alert(error.message);
      return;
    }

    // Go to the passenger's "Your Ride" page (FR-11.1, driver-vehicle feature)
    navigate("/assigned-driver");
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

            <div>
              {loadError && (
                <p className="load-error" role="alert">
                  {loadError}
                </p>
              )}

              <RideForm
                rideData={rideData}
                setRideData={setRideData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                routeOptions={routeOptions}
              />
            </div>

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