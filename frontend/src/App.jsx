import { Route, Routes } from "react-router-dom";
import RequireLogin from "./shared/RequireLogin";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import RideRequestPage from "./features/ride-request/pages/RideRequestPage";
import AssignedDriverPage from "./features/driver-vehicle/pages/AssignedDriverPage";

function App() {
  return (
    <Routes>
      {/* Open to everyone */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Need login: not-logged-in users are sent to /login */}
      <Route path="/" element={<RequireLogin><RideRequestPage /></RequireLogin>} />
      <Route path="/assigned-driver" element={<RequireLogin><AssignedDriverPage /></RequireLogin>} />
    </Routes>
  );
}

export default App;
