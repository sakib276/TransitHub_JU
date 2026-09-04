import { useState } from 'react';
import { reportEmergency } from '../services/emergencyService';

/**
 * Sends an emergency alert (FR-12.1 / FR-12.2) and tracks its send status.
 *
 * @returns {{status: string, errorMessage: string, alert: Object|null, send: Function, retry: Function}}
 * Current send status ('idle' | 'sending' | 'sent' | 'error'), an error
 * message (if any), the saved alert (if sent), a send function, and a retry
 * function that resends the last report.
 */
export function useEmergencyReport() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [alert, setAlert] = useState(null);
  const [lastReport, setLastReport] = useState(null);

  /**
   * Sends an emergency report.
   *
   * @param {Object} report - Emergency report details (see reportEmergency).
   * @returns {Promise<void>} Resolves once the send attempt finishes.
   */
  async function send(report) {
    setLastReport(report);
    setStatus('sending');
    setErrorMessage('');

    try {
      const savedAlert = await reportEmergency(report);
      setAlert(savedAlert);
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  }

  /**
   * Resends the last emergency report (used by the retry button after a
   * failed/offline attempt).
   *
   * @returns {Promise<void>} Resolves once the retry attempt finishes.
   */
  async function retry() {
    if (lastReport) {
      await send(lastReport);
    }
  }

  return { status, errorMessage, alert, send, retry };
}
