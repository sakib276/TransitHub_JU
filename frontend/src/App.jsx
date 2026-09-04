import { Route, Routes } from "react-router-dom";
import RideRequestPage from "./features/ride-request/pages/RideRequestPage";
import AssignedDriverPage from "./features/driver-vehicle/pages/AssignedDriverPage";
import PassengerEmergencyPage from "./features/emergency/pages/PassengerEmergencyPage";
import DriverEmergencyPage from "./features/emergency/pages/DriverEmergencyPage";
import AdminEmergencyAlertsPage from "./features/emergency/pages/AdminEmergencyAlertsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RideRequestPage />} />
      <Route path="/assigned-driver" element={<AssignedDriverPage />} />
      <Route path="/report-emergency" element={<PassengerEmergencyPage />} />
      <Route path="/driver-emergency" element={<DriverEmergencyPage />} />
      <Route path="/admin-emergency-alerts" element={<AdminEmergencyAlertsPage />} />
    </Routes>
  );
}

export default App;
