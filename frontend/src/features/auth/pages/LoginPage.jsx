import { useLocation, useNavigate } from 'react-router-dom';
import { LoginView } from '../views/LoginView';
import '../styles/auth.css';

/**
 * /login page. Shows the login form from the auth feature and, after a
 * successful login, goes back to the page the user originally wanted
 * (or the home page).
 *
 * @returns {JSX.Element} Login page.
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const goBackTo = location.state?.from || '/';

  return (
    <div className="th-auth-container">
      <LoginView
        onLogin={() => navigate(goBackTo, { replace: true })}
        onBackToRegistration={() => navigate('/register')}
        onForgotPassword={() => navigate('/reset-password')}
      />
    </div>
  );
}

export default LoginPage;
