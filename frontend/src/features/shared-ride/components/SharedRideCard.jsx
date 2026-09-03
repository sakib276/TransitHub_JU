/**
 * @fileoverview Passenger horizontal ride card with details, join/cancel and creator edit actions.
 * @module features/shared-ride/components/SharedRideCard
 * @author Nazmus Sakib
 */

import React from 'react';

export const SharedRideCard = ({
  ride,
  currentUserId = 'u_current',
  currentUserName = 'Nazmus Sakib',
  onBookRide,
  onCancelRide,
  onViewDetails,
  onEditRide,
  onCancelEntireTrip,
  onOpenFeedback
}) => {
  const isCreator = ride.creatorId === currentUserId || ride.creatorName === currentUserName;
  const isJoined = ride.joinedPassengers.some(
    (p) => p.name.toLowerCase() === currentUserName.toLowerCase()
  );
  const canEdit = isCreator && ride.joinedPassengers.length <= 1;

  const getVehicleIcon = (type) => (type.toLowerCase().includes('rickshaw') ? '🚲' : '🛺');

  return (
    <div className="sr-ride-card">
      <div className="sr-card-left">
        <div className="sr-vehicle-box">
          <span className="sr-vehicle-icon">{getVehicleIcon(ride.vehicleType)}</span>
          <span className="sr-vehicle-name">
            {ride.vehicleType.includes('Auto') ? 'Cart' : 'Rickshaw'}
          </span>
        </div>

        <div className="sr-route-info">
          <div className="sr-route-path">
            <span>{ride.pickupLocation}</span>
            <span className="sr-arrow">➔</span>
            <span>{ride.destinationLocation}</span>
          </div>
          <div className="sr-datetime-row">
            <span className="sr-dt-item">📅 {ride.departureDate}</span>
            <span className="sr-dt-item">⏰ {ride.departureTime}</span>
          </div>
        </div>
      </div>

      <div className="sr-card-stats">
        <div className="sr-stat-item">
          <span className="sr-stat-label">Available Seats</span>
          <span className={`sr-seats-val ${ride.seatsAvailable === 0 ? 'full' : 'open'}`}>
            👥 {ride.seatsAvailable}/{ride.totalSeats}
          </span>
        </div>

        <div className="sr-stat-item">
          <span className="sr-stat-label">Fare per person</span>
          <span className="sr-fare-val">৳ {ride.farePerSeat}</span>
        </div>
      </div>

      <div className="sr-card-actions">
        <button
          type="button"
          className="sr-view-details-btn"
          onClick={() => onViewDetails(ride)}
        >
          View Details
        </button>

        {isCreator ? (
          <div className="sr-creator-action-group">
            {canEdit && (
              <button
                type="button"
                className="sr-btn-edit-sm"
                onClick={() => onEditRide(ride)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="sr-book-btn joined"
              onClick={() => onCancelEntireTrip(ride.id, 'Creator')}
            >
              Cancel Ride
            </button>
          </div>
        ) : isJoined ? (
          <div className="sr-passenger-joined-group">
            <button
              type="button"
              className="sr-book-btn joined"
              onClick={() => onCancelRide(ride.id, currentUserName)}
            >
              Cancel Seat
            </button>
            <button
              type="button"
              className="sr-rate-btn-link"
              onClick={() => onOpenFeedback(ride)}
            >
              Rate / Report
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="sr-book-btn"
            disabled={ride.seatsAvailable <= 0}
            onClick={() => onBookRide(ride.id, currentUserName)}
          >
            {ride.seatsAvailable <= 0 ? 'Ride Full' : 'Book Shared Ride'}
          </button>
        )}
      </div>
    </div>
  );
};