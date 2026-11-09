/**
 * @fileoverview Passenger Registration View Component.
 * @module views/RegisterPassengerView
 */

import React, { useState } from 'react';
import { useRegistrationController } from '../controllers/useRegistrationController';

/**
 * Passenger Registration View Component.
 * @param {Object} props
 * @param {Function} props.onSwitchToLogin - Callback to switch view to login.
 */
export const RegisterPassengerView = ({ onSwitchToLogin }) => {
  const { loading, errorMessage, successMessage, registerPassenger } = useRegistrationController();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerPassenger(formData);
  };

  return (
    <div className="th-auth-card">
      <h2 className="th-auth-title">Passenger Registration</h2>
      <p className="th-auth-subtitle">Create your JU student or staff transit account</p>

      {errorMessage && <div className="th-alert-error">{errorMessage}</div>}
      {successMessage && <div className="th-alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="th-form-group">
          <label className="th-label">Full Name</label>
          <input
            className="th-input"
            type="text"
            placeholder="e.g. Shakil Ahmed"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Email Address</label>
          <input
            className="th-input"
            type="email"
            placeholder="name@juniv.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Mobile Number</label>
          <input
            className="th-input"
            type="tel"
            placeholder="017XXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Password</label>
          <input
            className="th-input"
            type="password"
            placeholder="Min 8 chars, uppercase, lowercase, digit"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Confirm Password</label>
          <input
            className="th-input"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        <button type="submit" className="th-btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Create Passenger Account'}
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