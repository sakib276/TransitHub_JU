import { Routes, Route } from "react-router-dom";
import SubmitAComplaintPage from "./src/features/submit-a-complaint/pages/submit-a-complaint-page";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/submit-a-complaint"
        element={<SubmitAComplaintPage />}
      />
    </Routes>
  );
}

export default AppRoutes;