/**
 * @fileoverview Role simulation bar supporting Passenger, Driver, and Admin access modes.
 * @module features/shared-ride/components/RoleSelectorBar
 * @author Nazmus Sakib
 */

import React from 'react';

export const RoleSelectorBar = ({ currentRole, onSelectRole }) => {
  return (
    <div className="sr-role-bar">
      <span className="sr-role-label">Active Login View:</span>
      <div className="sr-role-buttons">
        <button
          type="button"
          className={`sr-role-btn ${currentRole === 'passenger' ? 'active' : ''}`}
          onClick={() => onSelectRole('passenger')}
        >
          👤 Passenger View
        </button>
        <button
          type="button"
          className={`sr-role-btn ${currentRole === 'driver' ? 'active' : ''}`}
          onClick={() => onSelectRole('driver')}
        >
          🚗 Driver View
        </button>
        <button
          type="button"
          className={`sr-role-btn ${currentRole === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectRole('admin')}
        >
          🛡️ Admin View
        </button>
      </div>
    </div>
  );
};