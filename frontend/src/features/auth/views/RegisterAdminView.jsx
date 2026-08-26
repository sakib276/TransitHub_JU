/**
 * @fileoverview Administrator Registration View Component.
 * @module views/RegisterAdminView
 */

import React, { useState } from 'react';
import { useRegistrationController } from '../controllers/useRegistrationController';

/**
 * Admin Registration View Component.
 * @param {Object} props
 * @param {Function} props.onSwitchToLogin - Callback to switch view to login.
 */
export const RegisterAdminView = ({ onSwitchToLogin }) => {
  const { loading, errorMessage, successMessage, registerAdmin } = useRegistrationController();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    adminPasscode: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerAdmin(formData);
  };

  return (
    <div className="th-auth-card">
      <h2 className="th-auth-title">Admin Account Registration</h2>
      <p className="th-auth-subtitle">Authorized transport administration personnel only</p>

      {errorMessage && <div className="th-alert-error">{errorMessage}</div>}
      {successMessage && <div className="th-alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="th-form-group">
          <label className="th-label">Officer Full Name</label>
          <input
            className="th-input"
            type="text"
            placeholder="Official name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Official JU Email</label>
          <input
            className="th-input"
            type="email"
            placeholder="admin@juniv.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Authority Passcode (e.g. JU_ADMIN_AUTH_2026)</label>
          <input
            className="th-input"
            type="password"
            placeholder="Secret authority code"
            value={formData.adminPasscode}
            onChange={(e) => setFormData({ ...formData, adminPasscode: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Secure Password</label>
          <input
            className="th-input"
            type="password"
            placeholder="Min 8 chars, uppercase, lowercase, digit"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button type="submit" className="th-btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register Authority User'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem' }}>
        <span style={{ color: 'var(--th-secondary-text)' }}>Already registered? </span>
        <button type="button" className="th-link-btn" onClick={onSwitchToLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
};