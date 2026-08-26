/**
 * @fileoverview Auth Module Main Entry.
 * @module features/auth
 */

import React, { useState } from 'react';
import { RegisterPassengerView } from './views/RegisterPassengerView';
import { RegisterDriverView } from './views/RegisterDriverView';
import { RegisterAdminView } from './views/RegisterAdminView';
import './styles/auth.css';

/**
 * Primary Auth Feature Container.
 */
export const AuthFeature = () => {
  const [currentTab, setCurrentTab] = useState('passenger'); // 'passenger' | 'driver' | 'admin'

  return (
    <div className="th-auth-container">
      <div style={{ width: '100%', maxWidth: '30rem' }}>
        <div className="th-tabs-group">
          <button
            type="button"
            className={`th-tab-btn ${currentTab === 'passenger' ? 'active' : ''}`}
            onClick={() => setCurrentTab('passenger')}
          >
            Register Passenger
          </button>
          <button
            type="button"
            className={`th-tab-btn ${currentTab === 'driver' ? 'active' : ''}`}
            onClick={() => setCurrentTab('driver')}
          >
            Register Driver
          </button>
          <button
            type="button"
            className={`th-tab-btn ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentTab('admin')}
          >
            Register Admin
          </button>
        </div>

        {currentTab === 'passenger' && (
          <RegisterPassengerView onSwitchToLogin={() => alert('Login module will be tested in Part 2!')} />
        )}
        {currentTab === 'driver' && (
          <RegisterDriverView onSwitchToLogin={() => alert('Login module will be tested in Part 2!')} />
        )}
        {currentTab === 'admin' && (
          <RegisterAdminView onSwitchToLogin={() => alert('Login module will be tested in Part 2!')} />
        )}
      </div>
    </div>
  );
};

export default AuthFeature;