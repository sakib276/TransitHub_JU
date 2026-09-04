import { useState } from 'react';
import { useEmergencyReport } from '../hooks/useEmergencyReport';
import EmergencyButton from '../components/EmergencyButton';
import '../styles/emergency.css';

const MOCK_TRIP = {
  tripId: 'TRIP-2091',
  passengerName: 'Anika Rahman',
  contact: '01711-000000',
};

/**
 * Passenger page for FR-12.1: lets a passenger report an emergency during an
 * active trip. The "active trip" toggle is a local mock (no backend/shared
 * trip state exists yet) so the "no active trip" rejection can be tried out.
 *
 * @returns {JSX.Element} Passenger emergency page.
 */
function PassengerEmergencyPage() {
  const [hasActiveTrip, setHasActiveTrip] = useState(true);
  const { status, errorMessage, send, retry } = useEmergencyReport();

  function handlePress() {
    if (!hasActiveTrip) {
      return;
    }

    send({
      role: 'passenger',
      reporterName: MOCK_TRIP.passengerName,
      contact: MOCK_TRIP.contact,
      tripId: MOCK_TRIP.tripId,
    });
  }

  return (
    <div className="emergency-layout">
      <header className="header-placeholder">Header</header>

      <div className="emergency-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="emergency-content">
          <div className="page-title">
            <h1>Emergency</h1>
            <p>
              If something goes wrong during your trip, press the button below to alert
              the administrator with your location and trip details.
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
              disabledReason="You don't have an active trip, so an emergency can't be reported right now."
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

export default PassengerEmergencyPage;
