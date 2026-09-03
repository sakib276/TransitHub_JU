/**
 * @fileoverview Modal enabling ride creators to update details prior to joins (FR-6.2.2).
 * @module features/shared-ride/components/EditRideModal
 * @author Nazmus Sakib
 */

import React, { useState, useEffect } from 'react';
import { CAMPUS_LOCATIONS } from '../services/sharedRideService';

export const EditRideModal = ({ isOpen, ride, onClose, onEditSubmit }) => {
  const [departureTime, setDepartureTime] = useState('');
  const [farePerSeat, setFarePerSeat] = useState(15);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    if (ride) {
      setDepartureTime(ride.departureTime || '');
      setFarePerSeat(ride.farePerSeat || 15);
      setPickup(ride.pickupLocation || '');
      setDestination(ride.destinationLocation || '');
    }
  }, [ride]);

  if (!isOpen || !ride) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditSubmit(ride.id, {
      pickupLocation: pickup,
      destinationLocation: destination,
      departureTime,
      farePerSeat: Number(farePerSeat)
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-card">
        <div className="modal-header">
          <h3>Edit Shared Ride Details</h3>
          <button type="button" className="btn-close-x" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="edit-pickup">Pickup Location</label>
              <select id="edit-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)}>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} disabled={loc === destination}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-destination">Destination</label>
              <select id="edit-destination" value={destination} onChange={(e) => setDestination(e.target.value)}>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} disabled={loc === pickup}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="edit-departure-time">Departure Time</label>
              <input
                id="edit-departure-time"
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-fare">Fare per seat (৳)</label>
              <input
                id="edit-fare"
                type="number"
                min="5"
                step="5"
                value={farePerSeat}
                onChange={(e) => setFarePerSeat(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-cancel-flat" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-action">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};