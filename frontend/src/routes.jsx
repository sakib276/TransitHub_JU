import { Navigate, Route, Routes } from 'react-router-dom';

import { VehicleStatusPage } from './features/vehicle-status';

/**
 * Defines the routes available in the TransitHub JU frontend.
 *
 * @returns {JSX.Element} Application routes.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/vehicle-status"
        element={<VehicleStatusPage />}
      />

      <Route
        path="/"
        element={<Navigate to="/vehicle-status" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/vehicle-status" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;