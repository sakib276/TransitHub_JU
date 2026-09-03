/**
 * @fileoverview Modal dialog presenting full driver and passenger breakdown (FR-6.1.2).
 * @module features/shared-ride/components/RideDetailsModal
 * @author Nazmus Sakib
 */

import React from 'react';

export const RideDetailsModal = ({ isOpen, ride, onClose, onBookRide, currentUserName }) => {
  if (!isOpen || !ride) return null;

  const isJoined = ride.joinedPassengers.some(
    (p) => p.name.toLowerCase() === currentUserName.toLowerCase()
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-content-card">
        <div className="modal-header">
          <h3>Ride Details</h3>
          <button type="button" className="btn-close-x" onClick={onClose}>✕</button>
        </div>

        <div className="ride-details-grid" style={{ marginBottom: '16px' }}>
          <div className="detail-item">
            <span className="detail-label">Route</span>
            <span className="detail-value">{ride.pickupLocation} ➔ {ride.destinationLocation}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Departure</span>
            <span className="detail-value">⏰ {ride.departureTime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Vehicle</span>
            <span className="detail-value">{ride.vehicleType} ({ride.vehicleNumber})</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Driver / Creator</span>
            <span className="detail-value">👤 {ride.driverName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Per Person Fare</span>
            <span className="detail-value fare-highlight">৳ {ride.farePerSeat}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Available Capacity</span>
            <span className="detail-value">{ride.seatsAvailable} of {ride.totalSeats} seats open</span>
          </div>
        </div>

        <div className="passengers-roster" style={{ marginBottom: '20px' }}>
          <span className="roster-title">Joined Co-Passengers:</span>
          <div className="roster-chips">
            {ride.joinedPassengers.map((p) => (
              <span key={p.id} className={`passenger-chip ${p.isCreator ? 'creator-chip' : ''}`}>
                {p.name} {p.isCreator && '(Leader)'}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions-footer">
          <button type="button" className="btn-cancel-flat" onClick={onClose}>Close</button>
          {!isJoined && ride.seatsAvailable > 0 && (
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => {
                onBookRide(ride.id, currentUserName);
                onClose();
              }}
            >
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};