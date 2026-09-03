/**
 * @fileoverview Modal form enabling passengers to create a new shared ride request (FR-6.2).
 * @module features/shared-ride/components/CreateRideModal
 * @author Nazmus Sakib
 */

import React, { useState } from 'react';
import { CAMPUS_LOCATIONS } from '../services/sharedRideService';

export const CreateRideModal = ({ isModalOpen, onCloseModal, onCreateSubmit }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('In 10 mins');
  const [totalSeats, setTotalSeats] = useState(4);
  const [farePerSeat, setFarePerSeat] = useState(15);
  const [vehicleType, setVehicleType] = useState('Battery Auto');

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickup || !destination) {
      alert('Please select both pickup and destination.');
      return;
    }
    onCreateSubmit({
      pickupLocation: pickup,
      destinationLocation: destination,
      departureTime,
      totalSeats: Number(totalSeats),
      farePerSeat: Number(farePerSeat),
      vehicleType,
      creatorName: 'Nazmus Sakib'
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-card">
        <div className="modal-header">
          <h3>Create Shared Ride Request</h3>
          <button type="button" className="btn-close-x" onClick={onCloseModal}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="create-pickup-select">Pickup Point *</label>
              <select
                id="create-pickup-select"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              >
                <option value="">Select pickup</option>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} disabled={loc === destination}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="create-destination-select">Destination *</label>
              <select
                id="create-destination-select"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              >
                <option value="">Select destination</option>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} disabled={loc === pickup}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="create-departure-time">Departure Time</label>
              <input
                id="create-departure-time"
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="e.g. 10:45 AM or In 10 mins"
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-vehicle-type">Vehicle Type</label>
              <select
                id="create-vehicle-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="Battery Auto">Battery Auto (Cart)</option>
                <option value="Rickshaw">Rickshaw</option>
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="create-total-seats">Total Seats (Capacity)</label>
              <input
                id="create-total-seats"
                type="number"
                min="2"
                max="6"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-fare-seat">Estimated Fare / Seat (৳)</label>
              <input
                id="create-fare-seat"
                type="number"
                min="5"
                step="5"
                value={farePerSeat}
                onChange={(e) => setFarePerSeat(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-cancel-flat" onClick={onCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-action">
              Publish Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};