/**
 * @fileoverview Component to display side-by-side rickshaw and cart fare rates or empty placeholder.
 * @module features/fare/components/FareComparisonCard
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React from 'react';

/**
 * Renders fare comparison cards or empty status banner.
 * @param {Object} props - Component properties.
 * @param {Object|null} props.calculatedFareDetails - Calculated fare metadata.
 * @returns {JSX.Element} Rendered UI container.
 */
export const FareComparisonCard = ({ calculatedFareDetails }) => {
  if (!calculatedFareDetails) {
    return (
      <div className="dashed-empty-box">
        <div className="dashed-icon">💵</div>
        <div><em>Fare will appear here after selection</em></div>
      </div>
    );
  }

  if (!calculatedFareDetails.hasMatchingRoute) {
    return (
      <div className="no-fare-box">
        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚠️</div>
        <div className="no-fare-title">No Official Fare Available</div>
        <div className="no-fare-desc">{calculatedFareDetails.userFeedbackMessage}</div>
      </div>
    );
  }

  return (
    <div className="calculated-grid">
      <div className="fare-result-card">
        <div className="result-card-heading">🚲 RICKSHAW FARE</div>
        <div className="result-card-amount">৳ {calculatedFareDetails.rickshawFare}</div>
        <div className="result-card-sub">Solo / Reserved</div>
      </div>

      <div className="fare-result-card">
        <div className="result-card-heading">🚐 CART FARE</div>
        <div className="result-card-amount">৳ {calculatedFareDetails.cartFare}</div>
        <div className="result-card-sub">Per Seat / Shared</div>
      </div>
    </div>
  );
};