/**
 * @fileoverview Administrator management panel for maintaining campus fare matrices
 * and reviewing passenger overcharge complaints (SRS FR-5.3).
 * @module features/fare/components/AdminFareManager
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { CAMPUS_LOCATIONS_LIST, fareService } from '../services/fareService';

/**
 * Administration control panel for routes and complaints.
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.activeFareChartList - Currently loaded fare routes.
 * @param {Function} props.onUpdateFareChart - State update callback for parent component.
 * @returns {JSX.Element} Rendered Admin Manager UI.
 */
export const AdminFareManager = ({ activeFareChartList, onUpdateFareChart }) => {
  const [startLocationInput, setStartLocationInput] = useState('');
  const [destinationLocationInput, setDestinationLocationInput] = useState('');
  const [rickshawFareInput, setRickshawFareInput] = useState('');
  const [cartFareInput, setCartFareInput] = useState('');
  const [submittedComplaintsList, setSubmittedComplaintsList] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState('routes');
  const [statusMessage, setStatusMessage] = useState({ text: '', isSuccess: false });

  useEffect(() => {
    const fetchComplaints = async () => {
      const complaintsData = await fareService.getComplaints();
      setSubmittedComplaintsList(complaintsData);
    };

    fetchComplaints();
  }, []);

  /**
   * Handles adding a new route to the official matrix.
   * @param {React.FormEvent} formEvent - Event object.
   */
  const handleAddNewRoute = async (formEvent) => {
    formEvent.preventDefault();

    if (!startLocationInput || !destinationLocationInput || !rickshawFareInput || !cartFareInput) {
      setStatusMessage({ text: 'Please fill in all route fields.', isSuccess: false });
      return;
    }

    const response = await fareService.addRoute({
      from: startLocationInput,
      to: destinationLocationInput,
      rickshawFare: Number(rickshawFareInput),
      cartFare: Number(cartFareInput)
    });

    if (response.isSuccessful) {
      onUpdateFareChart(response.updatedData);
      setStatusMessage({ text: 'New route added successfully!', isSuccess: true });
      setStartLocationInput('');
      setDestinationLocationInput('');
      setRickshawFareInput('');
      setCartFareInput('');
    } else {
      setStatusMessage({ text: response.errorMessage, isSuccess: false });
    }
  };

  /**
   * Deletes a route entry from the active chart.
   * @param {number} routeIdentifier - Route unique identifier.
   */
  const handleDeleteRoute = async (routeIdentifier) => {
    const isUserConfirmed = window.confirm('Are you sure you want to remove this route?');
    if (isUserConfirmed) {
      const response = await fareService.deleteRoute(routeIdentifier);
      if (response.isSuccessful) {
        onUpdateFareChart(response.updatedData);
      }
    }
  };

  return (
    <div className="admin-panel-card">
      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeAdminTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('routes')}
          type="button"
        >
          📋 Manage Fare Chart ({activeFareChartList.length})
        </button>
        <button
          className={`admin-tab-btn ${activeAdminTab === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('complaints')}
          type="button"
        >
          🚨 Overcharge Complaints ({submittedComplaintsList.length})
        </button>
      </div>

      {activeAdminTab === 'routes' ? (
        <div>
          {/* Add Route Form */}
          <form className="admin-add-form" onSubmit={handleAddNewRoute}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
              Add New Official Campus Route
            </h3>

            {statusMessage.text && (
              <div className={`alert-msg ${statusMessage.isSuccess ? 'success' : 'error'}`}>
                {statusMessage.text}
              </div>
            )}

            <div className="admin-form-row">
              <select
                className="fare-select"
                value={startLocationInput}
                onChange={(e) => setStartLocationInput(e.target.value)}
              >
                <option value="">Select From</option>
                {CAMPUS_LOCATIONS_LIST.map((locationItem) => (
                  <option key={locationItem} value={locationItem}>
                    {locationItem}
                  </option>
                ))}
              </select>

              <select
                className="fare-select"
                value={destinationLocationInput}
                onChange={(e) => setDestinationLocationInput(e.target.value)}
              >
                <option value="">Select To</option>
                {CAMPUS_LOCATIONS_LIST.map((locationItem) => (
                  <option
                    key={locationItem}
                    value={locationItem}
                    disabled={locationItem === startLocationInput}
                  >
                    {locationItem}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Rickshaw (৳)"
                className="admin-input"
                value={rickshawFareInput}
                onChange={(e) => setRickshawFareInput(e.target.value)}
              />

              <input
                type="number"
                placeholder="Cart (৳)"
                className="admin-input"
                value={cartFareInput}
                onChange={(e) => setCartFareInput(e.target.value)}
              />

              <button type="submit" className="btn-calculate" style={{ height: '38px', padding: '0 1rem' }}>
                + Add Route
              </button>
            </div>
          </form>

          {/* Existing Route Table */}
          <div className="table-card-container">
            <table className="table-styled">
              <thead>
                <tr>
                  <th className="align-left">FROM</th>
                  <th className="align-left">TO</th>
                  <th className="align-right">RICKSHAW</th>
                  <th className="align-right">CART</th>
                  <th className="align-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {activeFareChartList.map((routeItem) => (
                  <tr key={routeItem.id || `${routeItem.from}-${routeItem.to}`}>
                    <td className="align-left td-place-bold">{routeItem.from}</td>
                    <td className="align-left">{routeItem.to}</td>
                    <td className="align-right td-fare-amount">৳ {routeItem.rickshawFare}</td>
                    <td className="align-right td-fare-amount">৳ {routeItem.cartFare}</td>
                    <td className="align-right">
                      <button
                        onClick={() => handleDeleteRoute(routeItem.id)}
                        style={{
                          color: '#dc2626',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Complaints View Table */
        <div className="table-card-container">
          {submittedComplaintsList.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No overcharge complaints reported yet.
            </div>
          ) : (
            <table className="table-styled">
              <thead>
                <tr>
                  <th className="align-left">VEHICLE IDENTIFIER</th>
                  <th className="align-right">CHARGED AMOUNT</th>
                  <th className="align-left">INCIDENT DETAILS</th>
                  <th className="align-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {submittedComplaintsList.map((complaintItem) => (
                  <tr key={complaintItem.reportId}>
                    <td className="align-left td-place-bold">
                      {complaintItem.vehicleIdentifier || 'Not Specified'}
                    </td>
                    <td className="align-right" style={{ color: '#dc2626', fontWeight: 700 }}>
                      ৳ {complaintItem.chargedFareAmount}
                    </td>
                    <td className="align-left">{complaintItem.incidentDetails || 'No details provided'}</td>
                    <td className="align-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {complaintItem.reportedAtTimestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};