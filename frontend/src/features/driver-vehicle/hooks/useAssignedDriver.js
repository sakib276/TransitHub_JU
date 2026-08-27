import { useEffect, useState } from 'react';
import { getAssignedDriver } from '../services/driverVehicleService';

// How often to check again while details are not ready yet.
const REFRESH_INTERVAL_MS = 3000;

/**
 * Loads the driver/vehicle assigned to a ride request and keeps refreshing
 * while the details are not ready yet.
 *
 * @param {string} requestId - Ride request id.
 * @returns {{status: string, driver: Object|null, errorMessage: string, retry: Function}}
 * Current load status ('loading' | 'ready' | 'unavailable' | 'error'), the
 * loaded driver (if any), an error message (if any), and a retry function.
 */
export function useAssignedDriver(requestId) {
  const [status, setStatus] = useState('loading');
  const [driver, setDriver] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadDriver() {
      setStatus('loading');
      setErrorMessage('');

      try {
        const result = await getAssignedDriver(requestId);

        if (isCancelled) {
          return;
        }

        if (result) {
          setDriver(result);
          setStatus('ready');
        } else {
          setDriver(null);
          setStatus('unavailable');
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setDriver(null);
        setStatus('error');
        setErrorMessage(error.message);
      }
    }

    loadDriver();

    return () => {
      isCancelled = true;
    };
  }, [requestId, attempt]);

  useEffect(() => {
    if (status !== 'unavailable') {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setAttempt((value) => value + 1);
    }, REFRESH_INTERVAL_MS);

    return () => clearTimeout(timerId);
  }, [status]);

  /**
   * Re-triggers loading of the assigned driver (used by the retry button).
   *
   * @returns {void}
   */
  function retry() {
    setAttempt((value) => value + 1);
  }

  return { status, driver, errorMessage, retry };
}
