import { useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordResetView } from '../views/PasswordResetView';
import '../styles/auth.css';

/**
 * /reset-password page. Without a token it asks for an email to send a
 * reset link to; with ?resetToken=... (from the email) it sets a new password.
 *
 * @returns {JSX.Element} Password reset page.
 */
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="th-auth-container">
      <PasswordResetView
        token={searchParams.get('resetToken') || ''}
        onBackToLogin={() => navigate('/login')}
      />
    </div>
  );
}

export default ResetPasswordPage;
