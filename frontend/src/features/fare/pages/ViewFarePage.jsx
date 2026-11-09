/**
 * @fileoverview Main passenger view page for checking official campus transit fares.
 * @module features/fare/pages/ViewFarePage
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React from 'react';
import { useFare } from '../hooks/useFare';
import { CAMPUS_LOCATIONS_LIST } from '../services/fareService';
import { FareComparisonCard } from '../components/FareComparisonCard';
import { FareChartTable } from '../components/FareChartTable';
import { ReportOverchargeModal } from '../components/ReportOverchargeModal';
import '../styles/fare.css';

/**
 * Main View Fare screen component.
 * @returns {JSX.Element} The rendered React view.
 */
export const ViewFarePage = () => {
  const {
    selectedPickupLocation,
    setSelectedPickupLocation,
    selectedDestinationLocation,
    setSelectedDestinationLocation,
    calculatedFareDetails,
    activeFareChartList,
    handleCalculateFare,
    handleSwapLocations,
    isReportModalVisible,
    setIsReportModalVisible,
    handleSubmitOverchargeReport
  } = useFare();

  return (
    <div className="app-container">
      {/* Top Application Navbar */}
      <header className="main-navbar">
        <div className="brand-section">
          <span>🚍</span> TransitHub_JU
        </div>
        <nav className="nav-menu">
          <span className="nav-item">Home</span>
          <span className="nav-item">Available Vehicles</span>
          <span className="nav-item active">View Fare</span>
          <span className="nav-item">Shared Ride</span>
          <span className="nav-item">My Rides</span>
        </nav>
        <div className="nav-right-icons">
          <button className="nav-icon" title="Notifications" type="button">🔔</button>
          <button className="nav-icon" title="Help" type="button">❓</button>
          <div className="profile-avatar">👤</div>
        </div>
      </header>

      {/* Main Feature Layout */}
      <main className="fare-content-wrapper">
        <h1 className="main-heading">View Fare</h1>
        <p className="sub-heading">
          Check the fixed fare between locations on campus. Reliability starts with transparency.
        </p>

        {/* Interactive Fare Calculator Container */}
        <section className="fare-calc-card">
          <div className="fare-calc-header">Calculate Fare</div>
          <div className="fare-calc-body">
            <div className="calc-controls-row">
              {/* Pickup Location Selector */}
              <div className="input-field-group">
                <label htmlFor="pickup-select">FROM</label>
                <div className="select-wrapper">
                  <span className="select-icon">📍</span>
                  <select
                    id="pickup-select"
                    className="fare-select"
                    value={selectedPickupLocation}
                    onChange={(e) => setSelectedPickupLocation(e.target.value)}
                  >
                    <option value="">Select start point</option>
                    {CAMPUS_LOCATIONS_LIST.map((locationName) => (
                      <option
                        key={locationName}
                        value={locationName}
                        disabled={locationName === selectedDestinationLocation}
                      >
                        {locationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bidirectional Location Swap Button */}
              <button
                className="btn-swap"
                onClick={handleSwapLocations}
                title="Swap locations"
                type="button"
              >
                ⇄
              </button>

              {/* Destination Location Selector */}
              <div className="input-field-group">
                <label htmlFor="destination-select">TO</label>
                <div className="select-wrapper">
                  <span className="select-icon">📍</span>
                  <select
                    id="destination-select"
                    className="fare-select"
                    value={selectedDestinationLocation}
                    onChange={(e) => setSelectedDestinationLocation(e.target.value)}
                  >
                    <option value="">Select destination</option>
                    {CAMPUS_LOCATIONS_LIST.map((locationName) => (
                      <option
                        key={locationName}
                        value={locationName}
                        disabled={locationName === selectedPickupLocation}
                      >
                        {locationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submission / Evaluation Trigger Button */}
              <button
                className="btn-calculate"
                onClick={handleCalculateFare}
                type="button"
              >
                Calculate Fare
              </button>
            </div>

            {/* Dynamic Comparison Card Display */}
            <FareComparisonCard calculatedFareDetails={calculatedFareDetails} />
          </div>
        </section>

        {/* Static Directory Title */}
        <h2 className="table-section-title">Predefined Fare List</h2>

        {/* Campus Fare List Table Card */}
        <FareChartTable activeFareChartList={activeFareChartList} />

        {/* Administration Policy & Overcharge Action Notice */}
        <div className="bottom-info-banner">
          <span className="info-icon">ℹ️</span>
          <div>
            <strong>Note:</strong> Fares are fixed by the administration. No additional charges are allowed. If you encounter any irregularities, please{' '}
            <span
              onClick={() => setIsReportModalVisible(true)}
              style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
              role="button"
              tabIndex={0}
            >
              report via the help center
            </span>.
          </div>
        </div>

        {/* Overcharge Complaint Modal Dialog */}
        <ReportOverchargeModal
          isModalOpen={isReportModalVisible}
          onCloseModal={() => setIsReportModalVisible(false)}
          onSubmitReport={handleSubmitOverchargeReport}
        />
      </main>
    </div>
  );
};