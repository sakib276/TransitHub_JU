import { describe, expect, it } from 'vitest';
import { getAssignedDriver } from '../services/driverVehicleService';

describe('getAssignedDriver', () => {
  it('returns driver and vehicle details for an accepted ride', async () => {
    const driver = await getAssignedDriver('REQ-1001');

    expect(driver).toEqual({
      driverName: 'Karim Mia',
      driverPhoto: 'https://i.pravatar.cc/150?img=12',
      vehicleType: 'Rickshaw',
      vehicleColor: 'Green',
      plateNumber: 'JU-RIK-101',
    });
  });

  it('returns null when details are not ready yet', async () => {
    const driver = await getAssignedDriver('REQ-1002');

    expect(driver).toBeNull();
  });

  it('throws an error to simulate a network failure', async () => {
    await expect(getAssignedDriver('REQ-1003')).rejects.toThrow(
      'Could not load driver details. Check your connection and try again.',
    );
  });

  it('throws an error when the request has no assigned driver', async () => {
    await expect(getAssignedDriver('REQ-9999')).rejects.toThrow(
      'No driver has been assigned to this ride yet.',
    );
  });
});
