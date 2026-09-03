/**
 * @fileoverview Driver control center for managing requests, accepting trips and no-shows (FR-6.3).
 * @module features/shared-ride/components/DriverRideManager
 * @author Nazmus Sakib
 */

import React from 'react';

export const DriverRideManager = ({
  ridesList,
  onAcceptReject,
  onNoShowPassenger,
  onCancelByDriver
}) => {
  return (
    <div className="driver-manager-container">
      <div className="driver-manager-header" style={{ marginBottom: '16px' }}>
        <h2 className="sr-list-title">Driver Dashboard: Trip & Seat Management</h2>
        <p className="sr-sub-title">Accept pending shared trips and monitor vehicle capacities in real-time.</p>
      </div>

      <div className="driver-rides-grid">
        {ridesList.length === 0 ? (
          <div className="empty-state-card">No shared ride requests available on campus right now.</div>
        ) : (
          ridesList.map((ride) => (
            <div key={ride.id} className="driver-ride-card">
              <div className="driver-card-header">
                <div>
                  <strong className="driver-route">{ride.pickupLocation} ➔ {ride.destinationLocation}</strong>
                  <div className="driver-sub-info" style={{ fontSize: '12px', color: '#64748b' }}>
                    ⏰ {ride.departureTime} | 🚗 {ride.vehicleType} ({ride.vehicleNumber})
                  </div>
                </div>
                <div className={`status-pill ${ride.seatsAvailable === 0 ? 'full' : 'open'}`}>
                  {ride.seatsAvailable} Seat(s) Available
                </div>
              </div>

              {ride.driverStatus === 'PENDING' ? (
                <div className="driver-pending-actions" style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#b45309', margin: '0 0 8px 0' }}>
                    ⚠️ New Trip Request from {ride.creatorName}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-accept-trip"
                      onClick={() => onAcceptReject(ride.id, 'ACCEPTED')}
                    >
                      Accept Trip
                    </button>
                    <button
                      type="button"
                      className="btn-reject-trip"
                      onClick={() => onAcceptReject(ride.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="driver-active-trip-body" style={{ marginTop: '12px' }}>
                  <span className="roster-heading" style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                    Passenger Roster ({ride.joinedPassengers.length}/{ride.totalSeats}):
                  </span>
                  <ul className="passenger-list" style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                    {ride.joinedPassengers.map((p) => (
                      <li key={p.id} className="passenger-row-item">
                        <span>👤 {p.name} {p.isCreator && '(Trip Creator)'}</span>
                        {!p.isCreator && (
                          <button
                            type="button"
                            className="btn-no-show"
                            onClick={() => onNoShowPassenger(ride.id, p.id)}
                            title="Remove passenger and free up seat"
                          >
                            Mark No-Show
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '12px', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-cancel-flat"
                      style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: '12px' }}
                      onClick={() => onCancelByDriver(ride.id, 'Driver')}
                    >
                      Cancel Entire Trip
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};