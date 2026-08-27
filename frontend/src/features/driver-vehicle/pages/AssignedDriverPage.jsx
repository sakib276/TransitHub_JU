import { useAssignedDriver } from '../hooks/useAssignedDriver';
import AssignedDriverCard from '../components/AssignedDriverCard';
import '../styles/driver-vehicle.css';

const STATUS_BADGE = {
  loading: { label: 'Loading', className: 'status-badge' },
  error: { label: 'Failed', className: 'status-badge failed' },
  ready: { label: 'Confirmed', className: 'status-badge' },
};

/**
 * Passenger page for FR-11.1: shows the assigned driver and vehicle once a
 * ride request is accepted.
 *
 * @returns {JSX.Element} Assigned driver page.
 */
function AssignedDriverPage() {
  const { status, driver, errorMessage, retry } = useAssignedDriver();
  const badge = STATUS_BADGE[status];

  return (
    <div className="assigned-driver-layout">
      <header className="header-placeholder">Header</header>

      <div className="assigned-driver-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="assigned-driver-content">
          <div className="page-title">
            <h1>Your Ride</h1>
            <p>
              Once your ride request is accepted, your driver&apos;s details show up here.
            </p>
          </div>

          <div className="card">
            <div className="status-header">
              <h2>Ride Status</h2>
              <span className={badge.className}>{badge.label}</span>
            </div>

            {status === 'loading' && (
              <div className="empty-status">
                <p>Loading driver details...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="empty-status error">
                <p>{errorMessage}</p>
                <button type="button" className="outline-btn" onClick={retry}>
                  Retry
                </button>
              </div>
            )}

            {status === 'ready' && driver && <AssignedDriverCard driver={driver} />}
          </div>
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}

export default AssignedDriverPage;
