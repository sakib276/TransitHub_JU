import { Route, Routes } from "react-router-dom";
import RideRequestPage from "./features/ride-request/pages/RideRequestPage";
import AssignedDriverPage from "./features/driver-vehicle/pages/AssignedDriverPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RideRequestPage />} />
      <Route path="/assigned-driver" element={<AssignedDriverPage />} />
    </Routes>
  );
}

export default App;
