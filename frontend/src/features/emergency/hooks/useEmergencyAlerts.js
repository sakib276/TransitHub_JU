import { useEffect, useState } from 'react';
import { coordinateResponse, getEmergencyAlerts } from '../services/emergencyService';

// How long to wait before auto-retrying a failed alert feed connection.
const RECONNECT_DELAY_MS = 2000;

/**
 * Loads and manages emergency alerts for the administrator dashboard
 * (FR-12.3). Auto-retries on connection failure instead of requiring a
 * manual retry, since a dropped emergency feed should reconnect on its own.
 *
 * @returns {{status: string, alerts: Object[], errorMessage: string, isReconnecting: boolean, coordinate: Function}}
 * Current load status ('loading' | 'ready' | 'error'), the loaded alerts,
 * an error message (if any), whether an auto-reconnect is in progress, and a
 * function to update an alert's status.
 */
export function useEmergencyAlerts() {
  const [status, setStatus] = useState('loading');
  const [alerts, setAlerts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    let reconnectTimer = null;

    async function loadAlerts() {
      try {
        const result = await getEmergencyAlerts();

        if (isCancelled) {
          return;
        }

        setAlerts(result);
        setStatus('ready');
        setErrorMessage('');
        setIsReconnecting(false);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setStatus('error');
        setErrorMessage(error.message);
        setIsReconnecting(true);
        reconnectTimer = setTimeout(() => {
          if (!isCancelled) {
            setAttempt((value) => value + 1);
          }
        }, RECONNECT_DELAY_MS);
      }
    }

    loadAlerts();

    return () => {
      isCancelled = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [attempt]);

  /**
   * Updates an alert's status (e.g. marks it as being coordinated/resolved).
   *
   * @param {number} alertId - Id of the alert to update.
   * @param {'Coordinating'|'Resolved'} nextStatus - New status for the alert.
   * @returns {Promise<void>} Resolves once the update finishes.
   */
  async function coordinate(alertId, nextStatus) {
    try {
      const updated = await coordinateResponse(alertId, nextStatus);
      setAlerts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return { status, alerts, errorMessage, isReconnecting, coordinate };
}
