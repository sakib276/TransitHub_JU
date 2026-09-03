/**
 * @fileoverview Backend tests for Shared Ride module (SRS FR-6).
 * @module features/shared-ride/tests/sharedRide.test
 */

const { describe, it, expect, beforeEach } = require('vitest');
const sharedRideService = require('../services/sharedRideService');
const SharedRideModel = require('../models/sharedRideModel');

describe('Backend Shared Ride MVC - Unit Tests (SRS FR-6)', () => {
  beforeEach(() => {
    SharedRideModel.reset();
  });

  it('lists active rides filtered by pickup and destination', () => {
    const results = sharedRideService.listRides('CSE', 'Dairy Gate');
    expect(results.length).toBe(1);
    expect(results[0].pickupLocation).toBe('CSE');
    expect(results[0].destinationLocation).toBe('Dairy Gate');
  });

  it('creates a new ride with creator occupying 1 seat (FR-6.2.1)', () => {
    const newRide = sharedRideService.createRide({
      pickupLocation: 'Bottola',
      destinationLocation: 'CSE',
      totalSeats: 4,
      farePerSeat: 15,
      creatorName: 'Nazmus Sakib'
    });

    expect(newRide.pickupLocation).toBe('Bottola');
    expect(newRide.seatsAvailable).toBe(3); // 4 - 1
    expect(newRide.joinedPassengers[0].isCreator).toBe(true);
  });

  it('allows passenger to join and updates seat availability (FR-6.1.3)', () => {
    const updated = sharedRideService.joinRide(101, 'Jesan CSE');
    expect(updated.joinedPassengers.some((p) => p.name === 'Jesan CSE')).toBe(true);
    expect(updated.seatsAvailable).toBe(1);
  });

  it('prevents overbooking when seats are zero (FR-6.4.3)', () => {
    // Fill the remaining seat of 101
    sharedRideService.joinRide(101, 'Passenger 1');

    // Attempting to join now should throw an error
    expect(() => {
      sharedRideService.joinRide(101, 'Extra Passenger');
    }).toThrow(/already full/i);
  });

  it('handles passenger cancellation and frees seat (FR-6.1.6)', () => {
    const updated = sharedRideService.cancelBooking(101, 'Jesan CSE');
    expect(updated.joinedPassengers.some((p) => p.name === 'Jesan CSE')).toBe(false);
  });

  it('handles driver no-show removal (FR-6.3.4)', () => {
    const ride = sharedRideService.joinRide(102, 'Late Student');
    const passenger = ride.joinedPassengers.find((p) => p.name === 'Late Student');

    const updated = sharedRideService.handleNoShow(102, passenger.id);
    expect(updated.joinedPassengers.some((p) => p.id === passenger.id)).toBe(false);
  });

  it('records reports and produces system analytics (FR-6.4.5 & FR-6.4.6)', () => {
    sharedRideService.submitReview({
      rideId: 101,
      driverName: 'Rafiqul Islam',
      ratingScore: 5,
      issueCategory: 'None',
      commentText: 'Good ride'
    });

    const analytics = sharedRideService.getAnalytics();
    expect(analytics.totalRidesCount).toBeGreaterThan(0);
    expect(analytics.occupancyRate).toContain('%');
    expect(analytics.complaints.length).toBe(1);
  });
});