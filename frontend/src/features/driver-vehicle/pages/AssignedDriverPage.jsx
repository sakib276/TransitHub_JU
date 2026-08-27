import { useState } from 'react';
import { useAssignedDriver } from '../hooks/useAssignedDriver';
import AssignedDriverCard from '../components/AssignedDriverCard';
import '../styles/driver-vehicle.css';

// Demo ride requests, one for each state described in FR-11.1.
const DEMO_REQUESTS = [
  { id: 'REQ-1001', label: 'Accepted ride (details ready)' },
  { id: 'REQ-1002', label: 'Accepted ride (details still loading)' },
  { id: 'REQ-1003', label: 'Accepted ride (network failure)' },
];

/**
 * Passenger page for FR-11.1: shows the assigned driver and vehicle once a
 * ride request is accepted.
 *
 * @returns {JSX.Element} Assigned driver page.
 */
function AssignedDriverPage() {
  const [requestId, setRequestId] = useState(DEMO_REQUESTS[0].id);
  const { status, driver, errorMessage, retry } = useAssignedDriver(requestId);

  return (
    <div className="assigned-driver-page">
      <h1>Your ride</h1>
      <p className="page-subtitle">
        Once your ride request is accepted, your driver&apos;s details show up here.
      </p>

      <label className="demo-picker" htmlFor="demo-request">
        Ride request (demo):{' '}
        <select
          id="demo-request"
          value={requestId}
          onChange={(event) => setRequestId(event.target.value)}
        >
          {DEMO_REQUESTS.map((request) => (
            <option key={request.id} value={request.id}>
              {request.label}
            </option>
          ))}
        </select>
      </label>

      {status === 'loading' && (
        <p className="status-text">Loading driver details...</p>
      )}

      {status === 'unavailable' && (
        <p className="status-text">
          Driver details aren&apos;t ready yet. Please wait, this refreshes automatically.
        </p>
      )}

      {status === 'error' && (
        <div className="status-text error">
          <p>{errorMessage}</p>
          <button type="button" className="retry-button" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {status === 'ready' && driver && <AssignedDriverCard driver={driver} />}
    </div>
  );
}

export default AssignedDriverPage;
