/**
 * @fileoverview Modal dialogue component allowing passengers to submit driver overcharge reports.
 * @module features/fare/components/ReportOverchargeModal
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React, { useState } from 'react';

/**
 * Modal form for reporting transportation pricing violations.
 * @param {Object} props - Component properties.
 * @param {boolean} props.isModalOpen - Boolean controlling modal visibility.
 * @param {Function} props.onCloseModal - Callback to close modal window.
 * @param {Function} props.onSubmitReport - Callback to process report submission.
 * @returns {JSX.Element|null} Rendered modal dialog.
 */
export const ReportOverchargeModal = ({ isModalOpen, onCloseModal, onSubmitReport }) => {
  const [vehicleIdentifier, setVehicleIdentifier] = useState('');
  const [chargedFareAmount, setChargedFareAmount] = useState('');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] = useState(false);

  if (!isModalOpen) {
    return null;
  }

  /**
   * Handles form submission and triggers success confirmation.
   * @param {React.FormEvent} formEvent - Form submission event.
   */
  const handleSubmit = async (formEvent) => {
    formEvent.preventDefault();
    await onSubmitReport({
      vehicleIdentifier,
      chargedFareAmount: Number(chargedFareAmount),
      incidentDetails
    });

    setHasSubmittedSuccessfully(true);
    setTimeout(() => {
      setHasSubmittedSuccessfully(false);
      onCloseModal();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
            Report Overcharging
          </h3>
          <button
            onClick={onCloseModal}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>

        {hasSubmittedSuccessfully ? (
          <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', textAlign: 'center' }}>
            Report submitted successfully to administration.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Vehicle / Driver Number
              </label>
              <input
                type="text"
                value={vehicleIdentifier}
                onChange={(e) => setVehicleIdentifier(e.target.value)}
                placeholder="e.g. Rickshaw #104"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-ui)', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Demanded Fare (৳)
              </label>
              <input
                type="number"
                required
                value={chargedFareAmount}
                onChange={(e) => setChargedFareAmount(e.target.value)}
                placeholder="Amount asked"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-ui)', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Incident Details
              </label>
              <textarea
                rows="3"
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                placeholder="Where did it happen? Any additional context..."
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-ui)', borderRadius: '6px', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-calculate" style={{ width: '100%', height: '40px' }}>
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};