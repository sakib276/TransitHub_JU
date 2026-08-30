/**
 * @fileoverview Presentational view for browsing available campus vehicles.
 * @module features/available-vehicles/views/AvailableVehiclesView
 */

import React from 'react';
import {
  Bell,
  Bike,
  Building2,
  CarFront,
  CircleUserRound,
  Home,
  MoreHorizontal,
  RefreshCw,
  UsersRound,
} from 'lucide-react';
import { LOCATIONS } from '../models/availableVehiclesModel';

const locationIcons = {
  building: Building2,
  home: Home,
  users: UsersRound,
  more: MoreHorizontal,
};

/**
 * Renders the Available Vehicles feature UI from controller state.
 * @param {Object} props - Controller state and callbacks.
 * @returns {React.JSX.Element} Vehicle availability page.
 */
export const AvailableVehiclesView = ({
  selectedLocationId,
  setSelectedLocationId,
  vehicles,
  isLoading,
  errorMessage,
  successMessage,
  lastUpdated,
  hasActiveRequest,
  isQueued,
  refreshVehicles,
  requestRide,
  joinQueue,
}) => {
  const selectedLocation = LOCATIONS.find((location) => location.id === selectedLocationId);
  const formattedTime = lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="av-page">
      <header className="av-navbar">
        <a className="av-brand" href="#available-vehicles" aria-label="TransitHub JU home">
          <span className="av-brand-mark" aria-hidden="true">
            <span className="av-rickshaw-canopy" />
            <span className="av-rickshaw-wheel av-rickshaw-wheel-left" />
            <span className="av-rickshaw-wheel av-rickshaw-wheel-right" />
          </span>
          <span>TransitHub_JU</span>
        </a>
        <nav className="av-nav-links" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a className="is-active" href="#available-vehicles" aria-current="page">Available Vehicles</a>
          <a href="#my-rides">My Rides</a>
        </nav>
        <div className="av-profile-actions">
          <button className="av-icon-button" type="button" aria-label="Notifications">
            <Bell size={22} />
            <span className="av-notification-dot" />
          </button>
          <button className="av-avatar" type="button" aria-label="Open profile"><CircleUserRound size={27} /></button>
        </div>
      </header>

      <main className="av-main" id="available-vehicles">
        <section className="av-intro" aria-labelledby="page-title">
          <h1 id="page-title">Available Vehicles</h1>
          <p>Select a location to see available rickshaws and carts.</p>
        </section>

        <section className="av-location-grid" aria-label="Choose pickup location">
          {LOCATIONS.map((location) => {
            const Icon = locationIcons[location.icon];
            const isSelected = selectedLocationId === location.id;
            return (
              <button
                className={`av-location-card ${isSelected ? 'is-selected' : ''}`}
                key={location.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedLocationId(location.id)}
              >
                <Icon size={28} strokeWidth={1.9} />
                <span>{location.name}</span>
              </button>
            );
          })}
        </section>

        <section className="av-results" aria-live="polite">
          <div className="av-results-heading">
            <h2>Vehicles at {selectedLocation?.name}</h2>
            <button className="av-refresh" type="button" onClick={refreshVehicles} disabled={isLoading}>
              Last updated: {formattedTime} <RefreshCw size={17} className={isLoading ? 'is-spinning' : ''} />
            </button>
          </div>

          {successMessage && <div className="av-alert av-alert-success" role="status">{successMessage}</div>}
          {errorMessage && (
            <div className="av-alert av-alert-error" role="alert">
              <span>{errorMessage}</span>
              <button type="button" onClick={refreshVehicles}>Try again</button>
            </div>
          )}

          {isLoading ? (
            <div className="av-state-card">Loading current vehicle availability…</div>
          ) : vehicles.length === 0 ? (
            <div className="av-state-card">
              <Bike size={30} />
              <div><h3>No vehicles available</h3><p>There are no active vehicles at this location right now.</p></div>
            </div>
          ) : (
            <div className="av-vehicle-list">
              {vehicles.map((vehicle) => {
                const VehicleIcon = vehicle.type === 'Cart' ? CarFront : Bike;
                return (
                  <article className="av-vehicle-card" key={vehicle.id}>
                    <div className="av-vehicle-icon"><VehicleIcon size={43} strokeWidth={1.6} /></div>
                    <div className="av-vehicle-details">
                      <div className="av-vehicle-title-row"><h3>{vehicle.type}</h3><span className="av-status-pill">Available</span></div>
                      <p><span>Route:</span> {vehicle.route}</p>
                      <p><span>Driver:</span> {vehicle.driverName}</p>
                    </div>
                    <div className="av-seat-actions">
                      <div className="av-seat-count"><span>Seats available</span><strong>{vehicle.seatsAvailable} / {vehicle.capacity}</strong></div>
                      <button type="button" className="av-request-button" disabled={hasActiveRequest || vehicle.seatsAvailable === 0} onClick={() => requestRide(vehicle.id)}>
                        {hasActiveRequest ? 'Request Sent' : 'Request Ride'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <aside className="av-queue-card">
            <div><h2>Can&apos;t find a ride?</h2><p>Join the queue and we&apos;ll notify you when a vehicle is available.</p></div>
            <button type="button" className="av-queue-button" disabled={isQueued} onClick={joinQueue}>{isQueued ? 'Joined Queue' : 'Join Queue'}</button>
          </aside>
        </section>
      </main>
      <footer className="av-footer">© 2026 TransitHub_JU. All rights reserved.</footer>
    </div>
  );
};
