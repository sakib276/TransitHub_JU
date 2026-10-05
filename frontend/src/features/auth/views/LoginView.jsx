import React, { useState } from 'react';
import { authRequest, saveAuthSession } from '../models/authApi';

/** Passenger password login and Driver one-time-code login. */
export function LoginView({ onBackToRegistration, onForgotPassword, onLogin }) {
  const [mode, setMode] = useState('passenger');
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      const result = await authRequest(mode === 'passenger' ? '/login/passenger' : '/login/driver/verify-otp',
        mode === 'passenger' ? { email: form.email, password: form.password } : { phone: form.phone, otp: form.otp });
      saveAuthSession(result); onLogin?.(result.user);
      setMessage(`Signed in as ${result.user.fullName}.`);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const sendOtp = async () => {
    setError(''); setMessage(''); setLoading(true);
    try { const result = await authRequest('/login/driver/request-otp', { phone: form.phone }); setMessage(result.message); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return <section className="th-auth-card" aria-labelledby="login-title">
    <h2 id="login-title" className="th-auth-title">Sign in to TransitHub JU</h2>
    <p className="th-auth-subtitle">Use your passenger password or driver OTP.</p>
    <div className="th-tabs-group" role="tablist" aria-label="Login type">
      <button type="button" role="tab" aria-selected={mode === 'passenger'} className={`th-tab-btn ${mode === 'passenger' ? 'active' : ''}`} onClick={() => { setMode('passenger'); setError(''); setMessage(''); }}>Passenger</button>
      <button type="button" role="tab" aria-selected={mode === 'driver'} className={`th-tab-btn ${mode === 'driver' ? 'active' : ''}`} onClick={() => { setMode('driver'); setError(''); setMessage(''); }}>Driver OTP</button>
    </div>
    {error && <div className="th-alert-error" role="alert">{error}</div>}
    {message && <div className="th-alert-success" role="status">{message}</div>}
    <form onSubmit={submit}>
      {mode === 'passenger' ? <>
        <div className="th-form-group"><label className="th-label" htmlFor="login-email">Email</label><input id="login-email" className="th-input" type="email" autoComplete="username" required value={form.email} onChange={update('email')} /></div>
        <div className="th-form-group"><label className="th-label" htmlFor="login-password">Password</label><input id="login-password" className="th-input" type="password" autoComplete="current-password" required value={form.password} onChange={update('password')} /></div>
        <button type="button" className="th-link-btn" onClick={onForgotPassword}>Forgot password?</button>
      </> : <>
        <div className="th-form-group"><label className="th-label" htmlFor="driver-phone">Registered phone number</label><input id="driver-phone" className="th-input" type="tel" autoComplete="tel" required placeholder="01XXXXXXXXX" value={form.phone} onChange={update('phone')} /></div>
        <button type="button" className="th-link-btn" onClick={sendOtp} disabled={loading}>Send / resend OTP</button>
        <div className="th-form-group"><label className="th-label" htmlFor="driver-otp">6-digit OTP</label><input id="driver-otp" className="th-input" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={form.otp} onChange={update('otp')} /></div>
      </>}
      <button type="submit" className="th-btn-primary" disabled={loading}>{loading ? 'Please wait…' : 'Sign In'}</button>
    </form>
    <button type="button" className="th-link-btn th-auth-back" onClick={onBackToRegistration}>← Back to registration</button>
  </section>;
}
