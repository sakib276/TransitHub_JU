import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from './session';

/**
 * Wraps a page that needs login. If nobody is logged in (or the login expired),
 * it sends the user to /login and remembers which page they wanted,
 * so the login page can send them back afterwards.
 *
 * Usage in App.jsx:
 *   <Route path="/assigned-driver" element={<RequireLogin><AssignedDriverPage /></RequireLogin>} />
 *
 * @param {Object} props - Component properties.
 * @param {JSX.Element} props.children - The page to show when logged in.
 * @returns {JSX.Element} The page, or a redirect.
 */
function RequireLogin({ children }) {
  const location = useLocation();

  // Password reset emails link to "/?resetToken=...". Send those to the reset page.
  if (new URLSearchParams(location.search).has('resetToken')) {
    return <Navigate to={`/reset-password${location.search}`} replace />;
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RequireLogin;
