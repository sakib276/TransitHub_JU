import { useEffect, useState } from 'react';
import { getAssignedDriver } from '../services/driverVehicleService';

/**
 * Loads the driver/vehicle assigned to the passenger's accepted ride.
 *
 * @returns {{status: string, driver: Object|null, errorMessage: string, retry: Function}}
 * Current load status ('loading' | 'ready' | 'error'), the loaded driver
 * (if any), an error message (if any), and a retry function.
 */
export function useAssignedDriver() {
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
        const result = await getAssignedDriver();

        if (isCancelled) {
          return;
        }

        setDriver(result);
        setStatus('ready');
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
  }, [attempt]);

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
