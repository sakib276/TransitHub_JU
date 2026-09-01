import { beforeEach, describe, expect, test, vi } from 'vitest';

let getAvailableVehicles;
let reserveVehicleSeat;

beforeEach(async () => {
  vi.resetModules();
  ({ getAvailableVehicles, reserveVehicleSeat } = await import('./availableVehiclesModel'));
});

describe('availableVehiclesModel', () => {
  test('returns only active vehicles for the selected location', async () => {
    const vehicles = await getAvailableVehicles('cse');

    expect(vehicles).toHaveLength(2);
    expect(vehicles.every((vehicle) => vehicle.location === 'cse')).toBe(true);
    expect(vehicles.every((vehicle) => vehicle.status === 'available')).toBe(true);
  });

  test('reserves a seat and returns the updated vehicle', async () => {
    const vehicle = await reserveVehicleSeat('veh-rickshaw-01');

    expect(vehicle).toMatchObject({ id: 'veh-rickshaw-01', seatsAvailable: 1, capacity: 3 });
  });

  test('rejects a request for an unknown vehicle', async () => {
    await expect(reserveVehicleSeat('missing-vehicle')).rejects.toThrow(
      'This vehicle is no longer available. Please refresh the list.',
    );
  });
});
