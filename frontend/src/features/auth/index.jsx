/**
 * @fileoverview Auth Module Main Entry.
 * @module features/auth
 */

import React, { useState } from 'react';
import { RegisterPassengerView } from './views/RegisterPassengerView';
import { RegisterDriverView } from './views/RegisterDriverView';
import { RegisterAdminView } from './views/RegisterAdminView';
import { LoginView } from './views/LoginView';
import { PasswordResetView } from './views/PasswordResetView';
import { clearAuthSession } from './models/authApi';
import './styles/auth.css';

/**
 * Primary Auth Feature Container.
 */
export const AuthFeature = () => {
  const [currentTab, setCurrentTab] = useState('passenger'); // 'passenger' | 'driver' | 'admin'
  const [page, setPage] = useState(new URLSearchParams(window.location.search).has('resetToken') ? 'reset' : 'register');
  const [resetToken, setResetToken] = useState(new URLSearchParams(window.location.search).get('resetToken') || '');
  const [signedInUser, setSignedInUser] = useState(null);

  return (
    <div className="th-auth-container">
      <div style={{ width: '100%', maxWidth: '30rem' }}>
        {page === 'login' && <LoginView onBackToRegistration={() => setPage('register')} onForgotPassword={() => setPage('reset')} onLogin={(user) => { setSignedInUser(user); setPage('signed-in'); }} />}
        {page === 'reset' && <PasswordResetView token={resetToken} onBackToLogin={() => { setResetToken(''); setPage('login'); }} />}
        {page === 'signed-in' && <section className="th-auth-card"><h2 className="th-auth-title">Welcome, {signedInUser?.fullName}</h2><p className="th-auth-subtitle">Signed in as {signedInUser?.role}.</p><button type="button" className="th-btn-primary" onClick={() => { clearAuthSession(); setSignedInUser(null); setPage('login'); }}>Sign Out</button></section>}
        {page === 'register' && <>
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
          <RegisterPassengerView onSwitchToLogin={() => setPage('login')} />
        )}
        {currentTab === 'driver' && (
          <RegisterDriverView onSwitchToLogin={() => setPage('login')} />
        )}
        {currentTab === 'admin' && (
          <RegisterAdminView onSwitchToLogin={() => setPage('login')} />
        )}
        </>}
      </div>
    </div>
  );
};

export default AuthFeature;
