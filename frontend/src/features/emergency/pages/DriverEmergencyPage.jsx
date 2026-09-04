import { useState } from 'react';
import { useEmergencyReport } from '../hooks/useEmergencyReport';
import EmergencyButton from '../components/EmergencyButton';
import '../styles/emergency.css';

const MOCK_TRIP = {
  tripId: 'TRIP-2091',
  driverName: 'Karim Mia',
  contact: '01911-000000',
  vehiclePlate: 'JU-RIK-101',
};

/**
 * Driver page for FR-12.2: lets a driver trigger an emergency alert (e.g.
 * breakdown, accident, medical issue) during an active trip. The "active
 * trip" toggle is a local mock, matching the passenger page.
 *
 * @returns {JSX.Element} Driver emergency page.
 */
function DriverEmergencyPage() {
  const [hasActiveTrip, setHasActiveTrip] = useState(true);
  const { status, errorMessage, send, retry } = useEmergencyReport();

  function handlePress() {
    if (!hasActiveTrip) {
      return;
    }

    send({
      role: 'driver',
      reporterName: MOCK_TRIP.driverName,
      contact: MOCK_TRIP.contact,
      tripId: MOCK_TRIP.tripId,
      vehiclePlate: MOCK_TRIP.vehiclePlate,
    });
  }

  return (
    <div className="emergency-layout">
      <header className="header-placeholder">Header</header>

      <div className="emergency-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="emergency-content">
          <div className="page-title">
            <h1>Driver Emergency Alert</h1>
            <p>
              Breakdown, accident, or medical issue during a trip? Trigger an alert so the
              administrator can dispatch help.
            </p>
          </div>

          <div className="card">
            <div className="status-header">
              <h2>Trip {MOCK_TRIP.tripId}</h2>
              <button
                type="button"
                className="outline-btn"
                onClick={() => setHasActiveTrip((value) => !value)}
              >
                {hasActiveTrip ? 'End Trip (test)' : 'Start Trip (test)'}
              </button>
            </div>

            <EmergencyButton
              status={status}
              errorMessage={errorMessage}
              disabled={!hasActiveTrip}
              disabledReason="You don't have an active trip, so an emergency alert can't be sent right now."
              onPress={handlePress}
              onRetry={retry}
            />
          </div>
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}

export default DriverEmergencyPage;
