/**
 * @fileoverview Driver quick fare verification screen component (SRS FR-5.2).
 * Enables drivers to check and display official rates with minimal interaction.
 * @module features/fare/components/DriverFareView
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { CAMPUS_LOCATIONS_LIST, fareService } from '../services/fareService';

/**
 * Driver fare lookup interface with high-contrast, large-touch controls.
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.activeFareChartList - Current active fare chart list.
 * @returns {JSX.Element} Rendered Driver view UI.
 */
export const DriverFareView = ({ activeFareChartList }) => {
  const [selectedPickupLocation, setSelectedPickupLocation] = useState('');
  const [selectedDestinationLocation, setSelectedDestinationLocation] = useState('');
  const [calculatedFareResult, setCalculatedFareResult] = useState(null);

  /**
   * Evaluates fare based on driver inputs.
   */
  const handleCalculateFare = () => {
    if (selectedPickupLocation && selectedDestinationLocation) {
      const evaluationResult = fareService.calculateFare(
        selectedPickupLocation,
        selectedDestinationLocation,
        activeFareChartList
      );
      setCalculatedFareResult(evaluationResult);
    }
  };

  return (
    <div className="driver-view-card">
      <div className="driver-header">
        <h2 style={{ margin: '0 0 0.4rem 0', fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
          🛺 Driver Quick Fare Checker
        </h2>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Verify official campus rate before starting trip
        </p>
      </div>

      <div className="driver-form-grid">
        <div className="input-field-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            START STAND
          </label>
          <select
            className="fare-select driver-select"
            value={selectedPickupLocation}
            onChange={(event) => {
              setSelectedPickupLocation(event.target.value);
              setCalculatedFareResult(null);
            }}
          >
            <option value="">-- Select Pickup Point --</option>
            {CAMPUS_LOCATIONS_LIST.map((locationItem) => (
              <option
                key={locationItem}
                value={locationItem}
                disabled={locationItem === selectedDestinationLocation}
              >
                {locationItem}
              </option>
            ))}
          </select>
        </div>

        <div className="input-field-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            DESTINATION
          </label>
          <select
            className="fare-select driver-select"
            value={selectedDestinationLocation}
            onChange={(event) => {
              setSelectedDestinationLocation(event.target.value);
              setCalculatedFareResult(null);
            }}
          >
            <option value="">-- Select Drop Point --</option>
            {CAMPUS_LOCATIONS_LIST.map((locationItem) => (
              <option
                key={locationItem}
                value={locationItem}
                disabled={locationItem === selectedPickupLocation}
              >
                {locationItem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="btn-calculate driver-btn"
        disabled={!selectedPickupLocation || !selectedDestinationLocation}
        onClick={handleCalculateFare}
        type="button"
        style={{ width: '100%', height: '44px', marginTop: '1rem' }}
      >
        Show Fare to Passenger
      </button>

      {calculatedFareResult && (
        <div style={{ marginTop: '1.5rem' }}>
          {calculatedFareResult.hasMatchingRoute ? (
            <div className="driver-result-box">
              <div className="driver-rate-box">
                <span className="driver-label">🚲 Rickshaw Fare</span>
                <span className="driver-price">৳ {calculatedFareResult.rickshawFare}</span>
              </div>
              <div className="driver-rate-box highlight">
                <span className="driver-label">🚐 Easy-Bike / Cart</span>
                <span className="driver-price">৳ {calculatedFareResult.cartFare}</span>
              </div>
            </div>
          ) : (
            <div className="no-fare-box">
              <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>⚠️</div>
              <div className="no-fare-title">No Official Fare Available</div>
              <div className="no-fare-desc">{calculatedFareResult.userFeedbackMessage}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};