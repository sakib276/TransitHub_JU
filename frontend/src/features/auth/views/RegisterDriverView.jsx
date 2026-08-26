/**
 * @fileoverview Driver Registration View Component.
 * @module views/RegisterDriverView
 */

import React, { useState } from 'react';
import { useRegistrationController } from '../controllers/useRegistrationController';

/**
 * Driver Registration View Component.
 * @param {Object} props
 * @param {Function} props.onSwitchToLogin - Callback to switch view to login.
 */
export const RegisterDriverView = ({ onSwitchToLogin }) => {
  const { loading, errorMessage, successMessage, registerDriver } = useRegistrationController();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    nid: '',
    vehicleType: 'Rickshaw (2 Seats)'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerDriver(formData);
  };

  return (
    <div className="th-auth-card">
      <h2 className="th-auth-title">Driver Enrollment</h2>
      <p className="th-auth-subtitle">Register Rickshaw or Campus Cart driver profile</p>

      {errorMessage && <div className="th-alert-error">{errorMessage}</div>}
      {successMessage && <div className="th-alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="th-form-group">
          <label className="th-label">Driver Full Name</label>
          <input
            className="th-input"
            type="text"
            placeholder="e.g. Mohammad Rafiq"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Phone Number (For OTP Verification)</label>
          <input
            className="th-input"
            type="tel"
            placeholder="01XXXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">National ID Number (NID)</label>
          <input
            className="th-input"
            type="text"
            placeholder="NID number"
            value={formData.nid}
            onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
          />
        </div>

        <div className="th-form-group">
          <label className="th-label">Vehicle Category</label>
          <select
            className="th-input"
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
          >
            <option value="Rickshaw (2 Seats)">Rickshaw (2 Seats)</option>
            <option value="Auto Rickshaw (4 Seats)">Auto Rickshaw (4 Seats)</option>
            <option value="Campus Cart (6 Seats)">Campus Cart (6 Seats)</option>
          </select>
        </div>

        <button type="submit" className="th-btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Enroll as Driver'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem' }}>
        <span style={{ color: 'var(--th-secondary-text)' }}>Already registered? </span>
        <button type="button" className="th-link-btn" onClick={onSwitchToLogin}>
          Sign In with OTP
        </button>
      </div>
    </div>
  );
};