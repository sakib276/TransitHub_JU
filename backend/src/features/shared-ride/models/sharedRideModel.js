/**
 * @fileoverview Model layer for Shared Ride (FR-6).
 * Handles raw data storage, querying, and direct state mutations.
 * @module features/shared-ride/models/sharedRideModel
 */

let sharedRidesDB = [
  {
    id: 101,
    creatorName: 'Nazmus Sakib',
    creatorId: 'u_current',
    driverName: 'Rafiqul Islam',
    driverStatus: 'ACCEPTED',
    vehicleType: 'Rickshaw',
    vehicleNumber: 'JU-Rick-04',
    pickupLocation: 'CSE',
    destinationLocation: 'Dairy Gate',
    departureDate: '22 May 2026',
    departureTime: '10:30 AM',
    totalSeats: 3,
    seatsAvailable: 2,
    farePerSeat: 15,
    status: 'OPEN',
    joinedPassengers: [
      { id: 'u_current', name: 'Nazmus Sakib', isCreator: true }
    ]
  },
  {
    id: 102,
    creatorName: 'Farhana Ahmed',
    creatorId: 'u_farhana',
    driverName: 'Abdul Karim',
    driverStatus: 'ACCEPTED',
    vehicleType: 'Battery Auto',
    vehicleNumber: 'JU-Cart-12',
    pickupLocation: 'CSE',
    destinationLocation: 'Bishmile',
    departureDate: '22 May 2026',
    departureTime: '11:00 AM',
    totalSeats: 4,
    seatsAvailable: 3,
    farePerSeat: 10,
    status: 'OPEN',
    joinedPassengers: [
      { id: 'u_farhana', name: 'Farhana Ahmed', isCreator: true }
    ]
  },
  {
    id: 103,
    creatorName: 'Mehedi Hasan',
    creatorId: 'u_mehedi',
    driverName: 'Alamgir Hossain',
    driverStatus: 'ACCEPTED',
    vehicleType: 'Rickshaw',
    vehicleNumber: 'JU-Rick-19',
    pickupLocation: 'Ladies Hall Road',
    destinationLocation: 'Prantic',
    departureDate: '22 May 2026',
    departureTime: '11:30 AM',
    totalSeats: 2,
    seatsAvailable: 1,
    farePerSeat: 20,
    status: 'OPEN',
    joinedPassengers: [
      { id: 'u_mehedi', name: 'Mehedi Hasan', isCreator: true }
    ]
  }
];

let complaintsDB = [];

const SharedRideModel = {
  findAll() {
    return [...sharedRidesDB];
  },

  findById(id) {
    return sharedRidesDB.find((r) => r.id === Number(id)) || null;
  },

  create(rideRecord) {
    sharedRidesDB.unshift(rideRecord);
    return rideRecord;
  },

  update(id, updatedFields) {
    const index = sharedRidesDB.findIndex((r) => r.id === Number(id));
    if (index === -1) return null;
    sharedRidesDB[index] = { ...sharedRidesDB[index], ...updatedFields };
    return sharedRidesDB[index];
  },

  saveComplaint(complaint) {
    complaintsDB.push(complaint);
    return complaint;
  },

  findAllComplaints() {
    return [...complaintsDB];
  },

 
  reset() {
    complaintsDB = [];
  }
};

module.exports = SharedRideModel;