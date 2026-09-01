import { Routes, Route } from "react-router-dom";

import SubmitAComplaintPage from "./src/features/submit-a-complaint/pages/submit-a-complaint-page";

function FeaturePlaceholder({ title }) {
  return (
    <section
      style={{
        padding: "40px",
        minHeight: "100%",
      }}
    >
      <h1>{title}</h1>

      <p>
        This feature will be implemented in its respective sprint.
      </p>
    </section>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/available-vehicles"
        element={
          <FeaturePlaceholder title="View Available Vehicles" />
        }
      />

      <Route
        path="/request-a-ride"
        element={
          <FeaturePlaceholder title="Request a Ride" />
        }
      />

      <Route
        path="/passenger-queue"
        element={
          <FeaturePlaceholder title="Passenger Queue System" />
        }
      />

      <Route
        path="/view-fare"
        element={
          <FeaturePlaceholder title="View Fare" />
        }
      />

      <Route
        path="/join-shared-ride"
        element={
          <FeaturePlaceholder title="Join Shared Ride" />
        }
      />

      <Route
        path="/vehicle-status"
        element={
          <FeaturePlaceholder title="Update Vehicle Status" />
        }
      />

      <Route
        path="/submit-a-complaint"
        element={<SubmitAComplaintPage />}
      />

      <Route
        path="/trip-history"
        element={
          <FeaturePlaceholder title="View Trip History" />
        }
      />

      <Route
        path="/manage-vehicles-drivers"
        element={
          <FeaturePlaceholder title="Manage Vehicles & Drivers" />
        }
      />

      <Route
        path="/report-emergency"
        element={
          <FeaturePlaceholder title="Report Emergency" />
        }
      />
    </Routes>
  );
}

export default AppRoutes;