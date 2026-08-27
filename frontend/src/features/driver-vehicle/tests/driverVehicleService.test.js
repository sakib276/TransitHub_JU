import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAssignedDriver } from '../services/driverVehicleService';

describe('getAssignedDriver', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns the assigned driver and vehicle details when the request succeeds', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const resultPromise = getAssignedDriver();
    await vi.runAllTimersAsync();
    const driver = await resultPromise;

    expect(driver).toEqual({
      driverName: 'Karim Mia',
      driverPhoto: 'https://i.pravatar.cc/150?img=12',
      vehicleType: 'Rickshaw',
      vehicleColor: 'Green',
      plateNumber: 'JU-RIK-101',
    });
  });

  it('throws an error to simulate an occasional network failure', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const resultPromise = getAssignedDriver();
    const assertion = expect(resultPromise).rejects.toThrow(
      'Could not load driver details. Check your connection and try again.',
    );

    await vi.runAllTimersAsync();
    await assertion;
  });
});
