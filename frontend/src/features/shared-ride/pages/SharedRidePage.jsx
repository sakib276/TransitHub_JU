/**
 * @fileoverview Main screen for Join Shared Ride module (SRS FR-6).
 * Automatically renders the correct interface based on authenticated role.
 * @module features/shared-ride/pages/SharedRidePage
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useSharedRide } from '../hooks/useSharedRide';
import { CAMPUS_LOCATIONS } from '../services/sharedRideService';
import { SharedRideCard } from '../components/SharedRideCard';
import { RideDetailsModal } from '../components/RideDetailsModal';
import { CreateRideModal } from '../components/CreateRideModal';
import { EditRideModal } from '../components/EditRideModal';
import { RateReportModal } from '../components/RateReportModal';
import { DriverRideManager } from '../components/DriverRideManager';
import { AdminSystemReportView } from '../components/AdminSystemReportView';
import '../styles/sharedRide.css';

export const SharedRidePage = () => {
  const {
    currentUserRole,
    allRidesList,
    filteredRidesList,
    searchPickup,
    setSearchPickup,
    searchDestination,
    setSearchDestination,
    handleSwapSearchLocations,
    isLoading,
    notificationAlert,
    systemAnalytics,
    handleJoinRide,
    handleCancelBooking,
    handleCancelEntireRide,
    handleCreateRideSubmit,
    handleEditRideSubmit,
    handleDriverResponse,
    handleNoShow,
    handleFeedbackSubmit,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isRateModalOpen,
    setIsRateModalOpen,
    selectedRideForAction,
    setSelectedRideForAction
  } = useSharedRide();

  const [activeDetailsRide, setActiveDetailsRide] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <div className="shared-ride-page">
      {/* Top Application Navbar */}
      <header className="sr-navbar">
        <div className="sr-brand">
          <span>🚍</span> TransitHub_JU
        </div>
        <nav className="sr-nav-links">
          <span className="sr-nav-item">Home</span>
          <span className="sr-nav-item">Available Vehicles</span>
          <span className="sr-nav-item">View Fare</span>
          <span className="sr-nav-item active">Shared Ride</span>
          <span className="sr-nav-item">My Rides</span>
        </nav>
        <div className="sr-nav-right">
          <button className="sr-icon-btn" title="Notifications" type="button">🔔</button>
          <button className="sr-icon-btn" title="Help" type="button">❓</button>
          <div className="sr-user-avatar">
            <span>👤</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="sr-container">
        {notificationAlert && (
          <div className={`notification-toast ${notificationAlert.type}`}>
            {notificationAlert.message}
          </div>
        )}

        {/* 1. PASSENGER VIEW */}
        {currentUserRole === 'passenger' && (
          <>
            <div className="sr-header-section">
              <div className="sr-title-action-row">
                <div>
                  <h1 className="sr-main-title">Join Shared Ride</h1>
                  <p className="sr-sub-title">
                    Share your ride and travel together. Save fare, travel smart.
                  </p>
                </div>
                <button
                  type="button"
                  className="sr-create-btn"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  ➕ Create Ride Request
                </button>
              </div>
            </div>

            {/* Route Filter Card */}
            <section className="sr-search-card">
              <form className="sr-search-form" onSubmit={(e) => e.preventDefault()}>
                <div className="sr-input-field">
                  <label htmlFor="search-from-select">From</label>
                  <div className="sr-select-box">
                    <span className="sr-field-icon">📍</span>
                    <select
                      id="search-from-select"
                      className="sr-select"
                      value={searchPickup}
                      onChange={(e) => setSearchPickup(e.target.value)}
                    >
                      <option value="">Select start point</option>
                      {CAMPUS_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} disabled={loc === searchDestination}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="sr-swap-btn"
                  title="Swap pickup and destination"
                  onClick={handleSwapSearchLocations}
                >
                  ⇄
                </button>

                <div className="sr-input-field">
                  <label htmlFor="search-to-select">To</label>
                  <div className="sr-select-box">
                    <span className="sr-field-icon">🚩</span>
                    <select
                      id="search-to-select"
                      className="sr-select"
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                    >
                      <option value="">Select destination</option>
                      {CAMPUS_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} disabled={loc === searchPickup}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="sr-search-btn">
                  <span>🔍</span> Search Rides
                </button>
              </form>
            </section>

            {/* List Header without Live Data */}
            <div className="sr-list-header">
              <h2 className="sr-list-title">Available Shared Rides</h2>
            </div>

            {/* Rides Stack */}
            <div className="sr-rides-stack">
              {isLoading ? (
                <div className="loading-state">Loading campus rides...</div>
              ) : filteredRidesList.length === 0 ? (
                <div className="no-rides-card">
                  <p>No active shared rides currently heading this way.</p>
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Start Your Own Request
                  </button>
                </div>
              ) : (
                filteredRidesList.map((ride) => (
                  <SharedRideCard
                    key={ride.id}
                    ride={ride}
                    currentUserId="u_current"
                    currentUserName="Nazmus Sakib"
                    onBookRide={handleJoinRide}
                    onCancelRide={handleCancelBooking}
                    onViewDetails={(r) => {
                      setActiveDetailsRide(r);
                      setIsDetailsModalOpen(true);
                    }}
                    onEditRide={(r) => {
                      setSelectedRideForAction(r);
                      setIsEditModalOpen(true);
                    }}
                    onCancelEntireTrip={handleCancelEntireRide}
                    onOpenFeedback={(r) => {
                      setSelectedRideForAction(r);
                      setIsRateModalOpen(true);
                    }}
                  />
                ))
              )}
            </div>

            {/* Info Banner */}
            <section className="sr-info-box">
              <div className="sr-info-icon-badge">👥</div>
              <div className="sr-info-content">
                <h4>What is Shared Ride?</h4>
                <p>
                  Shared Ride is a community-driven transportation feature designed specifically for the campus. It allows students and staff to pool their resources, sharing a single vehicle (Rickshaw or Cart) with others heading in the same direction. By splitting the cost, users enjoy a more affordable commute while reducing wait times and traffic congestion within the university grounds. It's a reliable, utility-focused solution for smart campus mobility.
                </p>
              </div>
            </section>
          </>
        )}

        {/* 2. DRIVER VIEW */}
        {currentUserRole === 'driver' && (
          <DriverRideManager
            ridesList={allRidesList}
            onAcceptReject={handleDriverResponse}
            onNoShowPassenger={handleNoShow}
            onCancelByDriver={handleCancelEntireRide}
          />
        )}

        {/* 3. SYSTEM / ADMIN VIEW */}
        {currentUserRole === 'admin' && (
          <AdminSystemReportView analytics={systemAnalytics} />
        )}

        {/* Floating Emergency Action Button */}
        <button
          type="button"
          className="sr-emergency-fab"
          title="Emergency Help"
          onClick={() => alert('Emergency alert dispatched to campus transport authority.')}
        >
          ✳️
        </button>

        {/* Modals */}
        <RideDetailsModal
          isOpen={isDetailsModalOpen}
          ride={activeDetailsRide}
          onClose={() => setIsDetailsModalOpen(false)}
          onBookRide={handleJoinRide}
          currentUserName="Nazmus Sakib"
        />

        <CreateRideModal
          isModalOpen={isCreateModalOpen}
          onCloseModal={() => setIsCreateModalOpen(false)}
          onCreateSubmit={handleCreateRideSubmit}
        />

        <EditRideModal
          isOpen={isEditModalOpen}
          ride={selectedRideForAction}
          onClose={() => setIsEditModalOpen(false)}
          onEditSubmit={handleEditRideSubmit}
        />

        <RateReportModal
          isModalOpen={isRateModalOpen}
          selectedRide={selectedRideForAction}
          onCloseModal={() => setIsRateModalOpen(false)}
          onSubmitReview={handleFeedbackSubmit}
        />
      </main>
    </div>
  );
};