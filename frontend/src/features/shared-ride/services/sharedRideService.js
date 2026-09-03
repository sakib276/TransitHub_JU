/**
 * @fileoverview Complete service layer for JU campus shared rides (SRS FR-6).
 * Handles ride search, creator management, driver capacity/no-shows, 
 * duplicate detection, instant seat allocations, and system reporting.
 * @module features/shared-ride/services/sharedRideService
 * @author Nazmus Sakib
 * @version 1.0.0
 */

const SHARED_RIDES_KEY = 'transithub_ju_shared_rides';
const SHARED_COMPLAINTS_KEY = 'transithub_ju_shared_complaints';
const SHARED_NOTIFICATIONS_KEY = 'transithub_ju_shared_notifications';

export const CAMPUS_LOCATIONS = [
  'CSE',
  'Dairy Gate',
  'Bishmile',
  'Ladies Hall Road',
  'Prantic',
  'Bottola',
  'Central Library',
  'Tajuddin Hall',
  'Mir Mosharraf Hossain Hall'
];

export const INITIAL_MOCK_RIDES = [
  {
    id: 101,
    creatorName: 'Nazmus Sakib',
    creatorId: 'u_current',
    driverName: 'Rafiqul Islam',
    driverId: 'drv_01',
    driverStatus: 'ACCEPTED', // 'PENDING' | 'ACCEPTED' | 'REJECTED'
    vehicleType: 'Rickshaw',
    vehicleNumber: 'JU-Rick-04',
    pickupLocation: 'CSE',
    destinationLocation: 'Dairy Gate',
    departureDate: '22 May 2026',
    departureTime: '10:30 AM',
    totalSeats: 3,
    seatsAvailable: 2,
    farePerSeat: 15,
    status: 'OPEN', // 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED'
    joinedPassengers: [
      { id: 'u_current', name: 'Nazmus Sakib', isCreator: true }
    ]
  },
  {
    id: 102,
    creatorName: 'Farhana Ahmed',
    creatorId: 'u_farhana',
    driverName: 'Abdul Karim',
    driverId: 'drv_02',
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
    driverId: 'drv_03',
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

export const sharedRideService = {
  /**
   * Retrieves all shared rides from cache.
   * @async
   * @returns {Promise<Array<Object>>}
   */
  async getAllRides() {
    const data = localStorage.getItem(SHARED_RIDES_KEY);
    if (!data) {
      localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(INITIAL_MOCK_RIDES));
      return INITIAL_MOCK_RIDES;
    }
    return JSON.parse(data);
  },

  /**
   * Dispatches real-time simulated notification.
   * @param {string} recipient - User identifier.
   * @param {string} message - Notification text.
   */
  dispatchNotification(recipient, message) {
    const list = JSON.parse(localStorage.getItem(SHARED_NOTIFICATIONS_KEY) || '[]');
    const newNote = {
      id: Date.now(),
      recipient,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem(SHARED_NOTIFICATIONS_KEY, JSON.stringify([newNote, ...list]));
  },

  /**
   * Filters active rides by route matching.
   * @param {string} pickup 
   * @param {string} destination 
   * @param {Array<Object>} ridesList 
   * @returns {Array<Object>}
   */
  filterRides(pickup, destination, ridesList = []) {
    return ridesList.filter((ride) => {
      const matchPickup = pickup ? ride.pickupLocation.toLowerCase() === pickup.toLowerCase() : true;
      const matchDest = destination ? ride.destinationLocation.toLowerCase() === destination.toLowerCase() : true;
      return matchPickup && matchDest && ride.status !== 'CANCELLED';
    });
  },

  /**
   * FR-6.2.3: Checks for existing duplicate rides along the same route.
   * @param {string} pickup 
   * @param {string} destination 
   * @param {Array<Object>} ridesList 
   * @returns {Object|null}
   */
  findDuplicateRide(pickup, destination, ridesList) {
    if (!pickup || !destination) return null;
    return (
      ridesList.find(
        (r) =>
          r.pickupLocation.toLowerCase() === pickup.toLowerCase() &&
          r.destinationLocation.toLowerCase() === destination.toLowerCase() &&
          r.seatsAvailable > 0 &&
          r.status === 'OPEN'
      ) || null
    );
  },

  /**
   * FR-6.2.1: Creates a new shared ride request.
   * @async
   * @param {Object} rideData 
   * @returns {Promise<{isSuccessful: boolean, updatedList: Array<Object>}>}
   */
  async createRide(rideData) {
    const currentList = await this.getAllRides();
    const totalSeats = Number(rideData.totalSeats) || 4;
    const newRide = {
      id: Date.now(),
      creatorName: rideData.creatorName || 'Nazmus Sakib',
      creatorId: rideData.creatorId || 'u_current',
      driverName: 'Pending Assignment',
      driverId: null,
      driverStatus: 'PENDING',
      vehicleType: rideData.vehicleType || 'Battery Auto',
      vehicleNumber: 'Pending',
      pickupLocation: rideData.pickupLocation,
      destinationLocation: rideData.destinationLocation,
      departureDate: rideData.departureDate || '22 May 2026',
      departureTime: rideData.departureTime || 'In 15 mins',
      totalSeats,
      seatsAvailable: totalSeats - 1,
      farePerSeat: Number(rideData.farePerSeat) || 15,
      status: 'OPEN',
      joinedPassengers: [
        { id: rideData.creatorId || 'u_current', name: rideData.creatorName || 'Nazmus Sakib', isCreator: true }
      ]
    };

    const updated = [newRide, ...currentList];
    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(updated));
    this.dispatchNotification('all', `New shared ride open: ${newRide.pickupLocation} ➔ ${newRide.destinationLocation}`);
    return { isSuccessful: true, updatedList: updated };
  },

  /**
   * FR-6.2.2: Edits ride details before any co-passenger joins.
   * @async
   * @param {number} rideId 
   * @param {Object} updatedFields 
   * @returns {Promise<{isSuccessful: boolean, message: string, updatedList: Array<Object>}>}
   */
  async editRideDetails(rideId, updatedFields) {
    const currentList = await this.getAllRides();
    const index = currentList.findIndex((r) => r.id === rideId);
    if (index === -1) return { isSuccessful: false, message: 'Ride not found.', updatedList: currentList };

    const target = currentList[index];
    if (target.joinedPassengers.length > 1) {
      return { isSuccessful: false, message: 'Cannot edit details after other passengers have joined.', updatedList: currentList };
    }

    currentList[index] = { ...target, ...updatedFields };
    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(currentList));
    return { isSuccessful: true, message: 'Ride details updated successfully.', updatedList: currentList };
  },

  /**
   * FR-6.1.3 & FR-6.4.3: Joins an open shared ride.
   * @async
   * @param {number} rideId 
   * @param {Object} passenger 
   * @returns {Promise<{isSuccessful: boolean, responseMessage: string, updatedList: Array<Object>}>}
   */
  async joinRide(rideId, passenger) {
    const currentList = await this.getAllRides();
    const idx = currentList.findIndex((r) => r.id === rideId);
    if (idx === -1) return { isSuccessful: false, responseMessage: 'Ride not found.', updatedList: currentList };

    const target = currentList[idx];
    if (target.seatsAvailable <= 0 || target.status === 'FULL') {
      return { isSuccessful: false, responseMessage: 'This ride is currently full.', updatedList: currentList };
    }

    const alreadyJoined = target.joinedPassengers.some(
      (p) => p.name.toLowerCase() === passenger.name.toLowerCase()
    );
    if (alreadyJoined) {
      return { isSuccessful: false, responseMessage: 'You are already registered for this ride.', updatedList: currentList };
    }

    const newSeatsAvailable = target.seatsAvailable - 1;
    currentList[idx] = {
      ...target,
      seatsAvailable: newSeatsAvailable,
      status: newSeatsAvailable === 0 ? 'FULL' : 'OPEN',
      joinedPassengers: [...target.joinedPassengers, { id: `p_${Date.now()}`, name: passenger.name, isCreator: false }]
    };

    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(currentList));
    this.dispatchNotification(target.creatorName, `${passenger.name} joined your shared ride.`);
    return { isSuccessful: true, responseMessage: 'Successfully booked your seat in the shared ride!', updatedList: currentList };
  },

  /**
   * FR-6.1.6: Passenger seat cancellation.
   * @async
   * @param {number} rideId 
   * @param {string} passengerName 
   * @returns {Promise<{isSuccessful: boolean, updatedList: Array<Object>}>}
   */
  async cancelBooking(rideId, passengerName) {
    const currentList = await this.getAllRides();
    const idx = currentList.findIndex((r) => r.id === rideId);
    if (idx === -1) return { isSuccessful: false, updatedList: currentList };

    const target = currentList[idx];
    const updatedPassengers = target.joinedPassengers.filter(
      (p) => p.name.toLowerCase() !== passengerName.toLowerCase()
    );

    const newSeatsAvailable = Math.min(target.totalSeats, target.seatsAvailable + 1);
    currentList[idx] = {
      ...target,
      seatsAvailable: newSeatsAvailable,
      status: 'OPEN',
      joinedPassengers: updatedPassengers
    };

    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(currentList));
    this.dispatchNotification(target.creatorName, `${passengerName} cancelled their seat reservation.`);
    return { isSuccessful: true, updatedList: currentList };
  },

  /**
   * FR-6.2.5 & FR-6.3.5: Cancels the entire ride (Creator or Driver).
   * @async
   * @param {number} rideId 
   * @param {string} cancelledByRole 
   * @returns {Promise<{isSuccessful: boolean, updatedList: Array<Object>}>}
   */
  async cancelEntireRide(rideId, cancelledByRole = 'Creator') {
    const currentList = await this.getAllRides();
    const idx = currentList.findIndex((r) => r.id === rideId);
    if (idx === -1) return { isSuccessful: false, updatedList: currentList };

    currentList[idx] = { ...currentList[idx], status: 'CANCELLED', seatsAvailable: 0 };
    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(currentList));
    this.dispatchNotification('passengers', `Notice: Shared Ride #${rideId} was cancelled by the ${cancelledByRole}.`);
    return { isSuccessful: true, updatedList: currentList };
  },

  /**
   * FR-6.3.2: Driver accepts or rejects a pending ride request.
   * @async
   * @param {number} rideId 
   * @param {'ACCEPTED'|'REJECTED'} action 
   * @param {string} driverName 
   * @returns {Promise<{isSuccessful: boolean, updatedList: Array<Object>}>}
   */
  async driverRespondRide(rideId, action, driverName = 'Abdul Karim') {
    const currentList = await this.getAllRides();
    const idx = currentList.findIndex((r) => r.id === rideId);
    if (idx === -1) return { isSuccessful: false, updatedList: currentList };

    currentList[idx] = {
      ...currentList[idx],
      driverStatus: action,
      driverName: action === 'ACCEPTED' ? driverName : 'Unassigned',
      status: action === 'ACCEPTED' ? 'OPEN' : 'CANCELLED'
    };

    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(currentList));
    return { isSuccessful: true, updatedList: currentList };
  },

  /**
   * FR-6.3.4: Driver removes a no-show passenger.
   * @async
   * @param {number} rideId 
   * @param {string} passengerId 
   * @returns {Promise<{isSuccessful: boolean, updatedList: Array<Object>}>}
   */
  async handleNoShow(rideId, passengerId) {
    const currentList = await this.getAllRides();
    const idx = currentList.findIndex((r) => r.id === rideId);
    if (idx === -1) return { isSuccessful: false, updatedList: currentList };

    const target = currentList[idx];
    const updatedPassengers = target.joinedPassengers.filter((p) => p.id !== passengerId);
    const newSeatsAvailable = Math.min(target.totalSeats, target.seatsAvailable + 1);

    currentList[idx] = {
      ...target,
      seatsAvailable: newSeatsAvailable,
      status: 'OPEN',
      joinedPassengers: updatedPassengers
    };

    localStorage.setItem(SHARED_RIDES_KEY, JSON.stringify(currentList));
    return { isSuccessful: true, updatedList: currentList };
  },

  /**
   * FR-6.1.7: Submits rating / issue report.
   * @async
   * @param {Object} payload 
   * @returns {Promise<{isSuccessful: boolean, message: string}>}
   */
  async submitRideReview(payload) {
    const reports = JSON.parse(localStorage.getItem(SHARED_COMPLAINTS_KEY) || '[]');
    const newEntry = {
      ...payload,
      reportId: Date.now(),
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem(SHARED_COMPLAINTS_KEY, JSON.stringify([...reports, newEntry]));
    return { isSuccessful: true, message: 'Review / Complaint submitted for administrative review.' };
  },

  /**
   * FR-6.4.5 & FR-6.4.6: Admin reports, metrics & complaint review.
   * @async
   * @returns {Promise<Object>}
   */
  async getSystemAnalytics() {
    const rides = await this.getAllRides();
    const complaints = JSON.parse(localStorage.getItem(SHARED_COMPLAINTS_KEY) || '[]');
    
    const totalRidesCount = rides.length;
    const completedOrActive = rides.filter((r) => r.status !== 'CANCELLED');
    const totalSeatsPlanned = completedOrActive.reduce((acc, r) => acc + r.totalSeats, 0);
    const totalSeatsFilled = completedOrActive.reduce((acc, r) => acc + (r.totalSeats - r.seatsAvailable), 0);
    const occupancyRate = totalSeatsPlanned > 0 ? Math.round((totalSeatsFilled / totalSeatsPlanned) * 100) : 0;
    const cancelledCount = rides.filter((r) => r.status === 'CANCELLED').length;

    return {
      totalRidesCount,
      occupancyRate: `${occupancyRate}%`,
      cancelledCount,
      complaints
    };
  }
};