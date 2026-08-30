/**
 * @fileoverview In-memory data source for the Available Vehicles feature.
 * @module features/available-vehicles/models/availableVehiclesModel
 */

/** @typedef {{id: string, name: string, icon: string}} Location */
/** @typedef {{id: string, type: string, driverName: string, route: string, location: string, seatsAvailable: number, capacity: number, status: string}} Vehicle */

/** @type {Location[]} */
export const LOCATIONS = [
  { id: 'cse', name: 'CSE', icon: 'building' },
  { id: 'dairy-gate', name: 'Dairy Gate', icon: 'home' },
  { id: 'bishmile', name: 'Bishmile', icon: 'building' },
  { id: 'ladies-hall-road', name: 'Ladies Hall Road', icon: 'users' },
  { id: 'prantic', name: 'Prantic', icon: 'building' },
  { id: 'other', name: 'Other', icon: 'more' },
];

/** @type {Vehicle[]} */
const INITIAL_VEHICLES = [
  {
    id: 'veh-rickshaw-01',
    type: 'Rickshaw',
    driverName: 'Rahim Uddin',
    route: 'CSE → Bishmile → Prantic',
    location: 'cse',
    seatsAvailable: 2,
    capacity: 3,
    status: 'available',
  },
  {
    id: 'veh-cart-01',
    type: 'Cart',
    driverName: 'Karim Hasan',
    route: 'CSE → Dairy Gate → Prantic',
    location: 'cse',
    seatsAvailable: 3,
    capacity: 5,
    status: 'available',
  },
  {
    id: 'veh-rickshaw-02',
    type: 'Rickshaw',
    driverName: 'Selim Mia',
    route: 'Dairy Gate → Bishmile → CSE',
    location: 'dairy-gate',
    seatsAvailable: 1,
    capacity: 3,
    status: 'available',
  },
];

let vehicles = INITIAL_VEHICLES.map((vehicle) => ({ ...vehicle }));

/**
 * Gets vehicles currently available at a location.
 * This boundary can be replaced by an API call once the backend is ready.
 * @param {string} locationId - Selected pickup location identifier.
 * @returns {Promise<Vehicle[]>} Available vehicles for the selected location.
 */
export const getAvailableVehicles = async (locationId) =>
  vehicles
    .filter((vehicle) => vehicle.location === locationId && vehicle.status === 'available')
    .map((vehicle) => ({ ...vehicle }));

/**
 * Reserves one available seat on a vehicle.
 * @param {string} vehicleId - Vehicle identifier.
 * @returns {Promise<Vehicle>} The updated vehicle.
 * @throws {Error} When the vehicle is no longer available.
 */
export const reserveVehicleSeat = async (vehicleId) => {
  const vehicle = vehicles.find((item) => item.id === vehicleId);

  if (!vehicle || vehicle.seatsAvailable < 1 || vehicle.status !== 'available') {
    throw new Error('This vehicle is no longer available. Please refresh the list.');
  }

  vehicle.seatsAvailable -= 1;
  return { ...vehicle };
};
