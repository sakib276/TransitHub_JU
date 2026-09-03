/**
 * @fileoverview Business logic layer for Shared Ride feature (FR-6).
 * Handles seat counting, duplicate checks, overbooking protection, and reviews.
 * @module features/shared-ride/services/sharedRideService
 */

const SharedRideModel = require('../models/sharedRideModel');

const sharedRideService = {
  // ১. রাইড খোঁজা ও রুট ম্যাচিং (FR-6.1.1 & FR-6.4.1)
  listRides(pickup, destination) {
    let rides = SharedRideModel.findAll().filter((r) => r.status !== 'CANCELLED');
    if (pickup) {
      rides = rides.filter((r) => r.pickupLocation.toLowerCase() === pickup.toLowerCase());
    }
    if (destination) {
      rides = rides.filter((r) => r.destinationLocation.toLowerCase() === destination.toLowerCase());
    }
    return rides;
  },

  // ২. নতুন রাইড রিকোয়েস্ট তৈরি (FR-6.2.1 & FR-6.2.3)
  createRide(data) {
    const totalSeats = Number(data.totalSeats) || 4;
    const newRide = {
      id: Date.now(),
      creatorName: data.creatorName || 'Nazmus Sakib',
      creatorId: data.creatorId || 'u_current',
      driverName: 'Pending Assignment',
      driverStatus: 'PENDING',
      vehicleType: data.vehicleType || 'Battery Auto',
      vehicleNumber: 'Pending',
      pickupLocation: data.pickupLocation,
      destinationLocation: data.destinationLocation,
      departureDate: data.departureDate || '22 May 2026',
      departureTime: data.departureTime || 'In 15 mins',
      totalSeats,
      seatsAvailable: totalSeats - 1, // ক্রিয়েটর ১টি সিট নেয়
      farePerSeat: Number(data.farePerSeat) || 15,
      status: 'OPEN',
      joinedPassengers: [
        { id: data.creatorId || 'u_current', name: data.creatorName || 'Nazmus Sakib', isCreator: true }
      ]
    };

    return SharedRideModel.create(newRide);
  },

  // ৩. প্যাসেঞ্জার সিট জয়েনিং ও ওভারবুকিং প্রতিরোধ (FR-6.1.3 & FR-6.4.3)
  joinRide(rideId, passengerName) {
    const ride = SharedRideModel.findById(rideId);
    if (!ride) throw new Error('Shared ride not found.');
    if (ride.seatsAvailable <= 0 || ride.status === 'FULL') {
      throw new Error('This ride is already full.');
    }

    const alreadyJoined = ride.joinedPassengers.some(
      (p) => p.name.toLowerCase() === passengerName.toLowerCase()
    );
    if (alreadyJoined) {
      throw new Error('Passenger already registered in this ride.');
    }

    const newSeatsAvailable = ride.seatsAvailable - 1;
    const updatedPassengers = [
      ...ride.joinedPassengers,
      { id: `p_${Date.now()}`, name: passengerName, isCreator: false }
    ];

    return SharedRideModel.update(rideId, {
      seatsAvailable: newSeatsAvailable,
      status: newSeatsAvailable === 0 ? 'FULL' : 'OPEN',
      joinedPassengers: updatedPassengers
    });
  },

  // ৪. সিট ক্যান্সেলেশন (FR-6.1.6)
  cancelBooking(rideId, passengerName) {
    const ride = SharedRideModel.findById(rideId);
    if (!ride) throw new Error('Shared ride not found.');

    const updatedPassengers = ride.joinedPassengers.filter(
      (p) => p.name.toLowerCase() !== passengerName.toLowerCase()
    );
    const newSeatsAvailable = Math.min(ride.totalSeats, ride.seatsAvailable + 1);

    return SharedRideModel.update(rideId, {
      seatsAvailable: newSeatsAvailable,
      status: 'OPEN',
      joinedPassengers: updatedPassengers
    });
  },

  // ৫. ড্রাইভার: নো-শো প্যাসেঞ্জার রিমুভ (FR-6.3.4)
  handleNoShow(rideId, passengerId) {
    const ride = SharedRideModel.findById(rideId);
    if (!ride) throw new Error('Shared ride not found.');

    const updatedPassengers = ride.joinedPassengers.filter((p) => p.id !== passengerId);
    const newSeatsAvailable = Math.min(ride.totalSeats, ride.seatsAvailable + 1);

    return SharedRideModel.update(rideId, {
      seatsAvailable: newSeatsAvailable,
      status: 'OPEN',
      joinedPassengers: updatedPassengers
    });
  },

  // ৬. ড্রাইভার: ট্রিপ এক্সেপ্ট বা রিজেক্ট (FR-6.3.2)
  driverResponse(rideId, action, driverName) {
    const ride = SharedRideModel.findById(rideId);
    if (!ride) throw new Error('Shared ride not found.');

    return SharedRideModel.update(rideId, {
      driverStatus: action,
      driverName: action === 'ACCEPTED' ? (driverName || 'Abdul Karim') : 'Unassigned',
      status: action === 'ACCEPTED' ? 'OPEN' : 'CANCELLED'
    });
  },

  // ৭. রেটিং ও কমপ্লেইন সাবমিশন (FR-6.1.7)
  submitReview(payload) {
    const report = {
      reportId: Date.now(),
      rideId: payload.rideId,
      driverName: payload.driverName,
      ratingScore: payload.ratingScore,
      issueCategory: payload.issueCategory || 'None',
      commentText: payload.commentText || '',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    return SharedRideModel.saveComplaint(report);
  },

  // ৮. সিস্টেম ও অ্যাডমিন রিপোর্ট (FR-6.4.5 & FR-6.4.6)
  getAnalytics() {
    const allRides = SharedRideModel.findAll();
    const active = allRides.filter((r) => r.status !== 'CANCELLED');
    const totalSeats = active.reduce((acc, r) => acc + r.totalSeats, 0);
    const filledSeats = active.reduce((acc, r) => acc + (r.totalSeats - r.seatsAvailable), 0);
    const occupancyRate = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;
    const cancelledCount = allRides.filter((r) => r.status === 'CANCELLED').length;

    return {
      totalRidesCount: allRides.length,
      occupancyRate: `${occupancyRate}%`,
      cancelledCount,
      complaints: SharedRideModel.findAllComplaints()
    };
  }
};

module.exports = sharedRideService;