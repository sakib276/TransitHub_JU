import React, { useState } from 'react';
import { authRequest } from '../models/authApi';

/** Request an email reset link or complete a reset from its URL token. */
export function PasswordResetView({ token, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      const result = token
        ? await authRequest('/password-reset/complete', { token, password })
        : await authRequest('/password-reset/request', { email });
      setMessage(result.message);
      if (token) window.history.replaceState({}, '', window.location.pathname);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return <section className="th-auth-card">
    <h2 className="th-auth-title">{token ? 'Choose a new password' : 'Reset your password'}</h2>
    <p className="th-auth-subtitle">{token ? 'Use at least 8 characters with uppercase, lowercase, and a number.' : 'We will email a single-use reset link if the account exists.'}</p>
    {error && <div className="th-alert-error" role="alert">{error}</div>}
    {message && <div className="th-alert-success" role="status">{message}</div>}
    <form onSubmit={submit}>
      {!token && <div className="th-form-group"><label className="th-label" htmlFor="reset-email">Account email</label><input id="reset-email" className="th-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>}
      {token && <div className="th-form-group"><label className="th-label" htmlFor="reset-password">New password</label><input id="reset-password" className="th-input" type="password" autoComplete="new-password" minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>}
      <button type="submit" className="th-btn-primary" disabled={loading}>{loading ? 'Please wait…' : token ? 'Update password' : 'Send reset link'}</button>
    </form>
    <button type="button" className="th-link-btn th-auth-back" onClick={onBackToLogin}>← Back to login</button>
  </section>;
}
