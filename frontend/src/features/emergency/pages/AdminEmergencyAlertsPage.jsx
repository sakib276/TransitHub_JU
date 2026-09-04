import { useEmergencyAlerts } from '../hooks/useEmergencyAlerts';
import EmergencyAlertCard from '../components/EmergencyAlertCard';
import '../styles/emergency.css';

/**
 * Administrator page for FR-12.3: shows incoming emergency alerts with
 * location, trip, and contact info, and lets the admin coordinate a
 * response. Auto-reconnects if the alert feed connection drops.
 *
 * @returns {JSX.Element} Admin emergency alerts page.
 */
function AdminEmergencyAlertsPage() {
  const { status, alerts, errorMessage, isReconnecting, coordinate } = useEmergencyAlerts();

  return (
    <div className="emergency-layout">
      <header className="header-placeholder">Header</header>

      <div className="emergency-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="emergency-content">
          <div className="page-title">
            <h1>Emergency Alerts</h1>
            <p>Live alerts reported by passengers and drivers during active trips.</p>
          </div>

          <div className="card">
            {status === 'loading' && (
              <div className="empty-status">
                <p>Loading emergency alerts...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="empty-status error">
                <p>{errorMessage}</p>
                {isReconnecting && <p>Reconnecting...</p>}
              </div>
            )}

            {status === 'ready' && alerts.length === 0 && (
              <div className="empty-status">
                <p>No emergency alerts right now.</p>
              </div>
            )}

            {status === 'ready' && alerts.length > 0 && (
              <div className="emergency-alert-list">
                {alerts.map((alert) => (
                  <EmergencyAlertCard key={alert.id} alert={alert} onCoordinate={coordinate} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}

export default AdminEmergencyAlertsPage;
