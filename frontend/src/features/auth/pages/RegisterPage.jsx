import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterPassengerView } from '../views/RegisterPassengerView';
import { RegisterDriverView } from '../views/RegisterDriverView';
import { RegisterAdminView } from '../views/RegisterAdminView';
import '../styles/auth.css';

const TABS = [
  { key: 'passenger', label: 'Register Passenger', View: RegisterPassengerView },
  { key: 'driver', label: 'Register Driver', View: RegisterDriverView },
  { key: 'admin', label: 'Register Admin', View: RegisterAdminView },
];

/**
 * /register page. Same three registration forms as the auth feature,
 * with "Sign in" links going to the /login page.
 *
 * @returns {JSX.Element} Register page.
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('passenger');
  const { View } = TABS.find((tab) => tab.key === currentTab);

  return (
    <div className="th-auth-container">
      <div style={{ width: '100%', maxWidth: '30rem' }}>
        <div className="th-tabs-group">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`th-tab-btn ${currentTab === tab.key ? 'active' : ''}`}
              onClick={() => setCurrentTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <View onSwitchToLogin={() => navigate('/login')} />
      </div>
    </div>
  );
}

export default RegisterPage;
