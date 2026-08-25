import StatusInfo from '../components/StatusInfo';
import StatusSelector from '../components/StatusSelector';
import '../styles/vehicleStatus.css';

/**
 * Renders the driver's vehicle status page.
 *
 * @returns {JSX.Element} Vehicle status page.
 */
function VehicleStatusPage() {
  return (
    <main className="vehicle-status-page">
      <section className="vehicle-status-header">
        <h1>My Status</h1>

        <p>
          Let passengers know if you can take a ride right now.
        </p>
      </section>

      <section className="preview-state">
        <span className="preview-label">PREVIEW STATE</span>

        <button
          type="button"
          className="preview-button active"
        >
          Default
        </button>

        <button
          type="button"
          className="preview-button"
        >
          Missing stand
        </button>

        <button
          type="button"
          className="preview-button"
        >
          Save failed
        </button>
      </section>

      <section className="vehicle-status-grid">
        <StatusSelector />
        <StatusInfo />
      </section>
    </main>
  );
}

export default VehicleStatusPage;