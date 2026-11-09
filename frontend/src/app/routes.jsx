import { Routes, Route } from 'react-router-dom';
import Home from '../features/home/pages/Home';
import Notifications from '../features/notification/pages/Notifications';

/**
 * Central route configuration for TransitHub_JU.
 *
 * Maps application URL paths to their corresponding feature pages.
 * New feature routes should be added here as `<Route />` entries.
 *
 * @returns {JSX.Element} The configured set of application routes.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default AppRoutes;