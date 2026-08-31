import { useState } from "react";

import DriverRideRequestsPage from "./features/ride-request/pages/DriverRideRequestsPage";
import RideRequestPage from "./features/ride-request/pages/RideRequestPage";
import AdminRideRequestsPage from "./features/ride-request/pages/AdminRideRequestsPage";

import AdminQueuePage from "./features/passenger-queue-system/pages/AdminQueuePage";
import DriverQueuePage from "./features/passenger-queue-system/pages/DriverQueuePage";
import PassengerQueuePage from "./features/passenger-queue-system/pages/PassengerQueuePage";

function App() {
  const [page, setPage] = useState("driverQueue");

  const pages = {
    passengerRide: <RideRequestPage />,
    driverRide: <DriverRideRequestsPage />,
    adminRide: <AdminRideRequestsPage />,
    passengerQueue: <PassengerQueuePage />,
    driverQueue: <DriverQueuePage />,
    adminQueue: <AdminQueuePage />,
  };

  return (
    <div>
      {/* Demo Navigation */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          padding: "16px",
          background: "#f3f4f6",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button onClick={() => setPage("passengerRide")}>Passenger Ride</button>
        <button onClick={() => setPage("driverRide")}>Driver Ride</button>
        <button onClick={() => setPage("adminRide")}>Admin Ride</button>

        <button onClick={() => setPage("passengerQueue")}>Passenger Queue</button>
        <button onClick={() => setPage("driverQueue")}>Driver Queue</button>
        <button onClick={() => setPage("adminQueue")}>Admin Queue</button>
      </div>

      {/* Selected Page */}
      {pages[page]}
    </div>
  );
}

export default App;