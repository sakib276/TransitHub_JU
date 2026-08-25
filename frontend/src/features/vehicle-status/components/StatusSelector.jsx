import { useEffect, useState } from 'react';
import VehicleStatusCard from './VehicleStatusCard';
import {
  VEHICLE_STANDS,
  VEHICLE_STATUS,
  getVehicleStatus,
  updateVehicleStatus,
} from '../services/vehicleStatusService';

/**
 * Allows a driver to select and update their current vehicle status.
 *
 * @returns {JSX.Element} Status selector form.
 */
function StatusSelector() {
  const [status, setStatus] = useState(VEHICLE_STATUS.AVAILABLE);
  const [standId, setStandId] = useState('');
  const [updatedAt, setUpdatedAt] = useState('2m ago');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    /**
     * Loads the driver's current vehicle status.
     *
     * @returns {Promise<void>} Resolves when status is loaded.
     */
    async function loadStatus() {
      const vehicleStatus = await getVehicleStatus();

      setStatus(vehicleStatus.status);
      setStandId(vehicleStatus.standId);
      setUpdatedAt(vehicleStatus.updatedAt);
    }

    loadStatus();
  }, []);

  /**
   * Handles vehicle status selection.
   *
   * @param {string} nextStatus - Selected vehicle status.
   * @returns {void}
   */
  function handleStatusChange(nextStatus) {
    setStatus(nextStatus);
    setMessage('');
    setMessageType('');

    if (nextStatus !== VEHICLE_STATUS.AVAILABLE) {
      setStandId('');
    }
  }

  /**
   * Handles stand selection.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Select event.
   * @returns {void}
   */
  function handleStandChange(event) {
    setStandId(event.target.value);
    setMessage('');
    setMessageType('');
  }

  /**
   * Saves the selected vehicle status.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   * @returns {Promise<void>} Resolves after saving.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage('');
    setMessageType('');
    setIsSaving(true);

    try {
      const updatedStatus = await updateVehicleStatus(status, standId);

      setUpdatedAt(updatedStatus.updatedAt);
      setMessage('Your vehicle status has been updated successfully.');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="status-card">
      <VehicleStatusCard updatedAt={updatedAt} />

      <form className="status-form" onSubmit={handleSubmit}>
        <div className="status-options">
          <button
            type="button"
            className={`status-option ${
              status === VEHICLE_STATUS.AVAILABLE
                ? 'selected available'
                : ''
            }`}
            onClick={() => handleStatusChange(VEHICLE_STATUS.AVAILABLE)}
          >
            ✓ Available
          </button>

          <button
            type="button"
            className={`status-option ${
              status === VEHICLE_STATUS.BUSY ? 'selected busy' : ''
            }`}
            onClick={() => handleStatusChange(VEHICLE_STATUS.BUSY)}
          >
            ⊗ Busy
          </button>

          <button
            type="button"
            className={`status-option ${
              status === VEHICLE_STATUS.OFFLINE
                ? 'selected offline'
                : ''
            }`}
            onClick={() => handleStatusChange(VEHICLE_STATUS.OFFLINE)}
          >
            ◷ Offline
          </button>
        </div>

        <div className="form-divider" />

        <label htmlFor="vehicle-stand">
          Current stand <span>*</span>
        </label>

        <select
          id="vehicle-stand"
          value={standId}
          onChange={handleStandChange}
          disabled={status !== VEHICLE_STATUS.AVAILABLE}
        >
          <option value="">Select your stand</option>

          {VEHICLE_STANDS.map((stand) => (
            <option key={stand.id} value={stand.id}>
              {stand.name}
            </option>
          ))}
        </select>

        <p className="field-help">
          Passengers browsing Available Vehicles will see you here instantly.
        </p>

        {message && (
          <div className={`status-message ${messageType}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Status'}
        </button>
      </form>
    </div>
  );
}

export default StatusSelector;