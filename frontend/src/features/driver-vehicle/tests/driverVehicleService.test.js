import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAssignedDriver } from '../services/driverVehicleService';

/**
 * Makes a fake fetch() response.
 *
 * @param {number} status - HTTP status code.
 * @param {Object} body - JSON body.
 * @returns {Object} Fake response.
 */
function fakeResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

describe('getAssignedDriver', () => {
  beforeEach(() => {
    sessionStorage.setItem('th_auth_token', 'test-token');
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('calls the backend with the login token and returns the driver', async () => {
    const driver = { driverName: 'Karim Mia', vehicleNumber: 'JU-BUS-01' };
    const fetchMock = vi.fn().mockResolvedValue(fakeResponse(200, { data: driver }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getAssignedDriver()).resolves.toEqual(driver);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/driver-vehicle/assigned-driver',
      { headers: { Authorization: 'Bearer test-token' } },
    );
  });

  it('asks the user to log in when there is no token', async () => {
    sessionStorage.clear();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(getAssignedDriver()).rejects.toThrow(
      'Please log in as a passenger to see your driver.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows the backend message when there is no accepted ride', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(fakeResponse(404, { message: 'You have no accepted ride yet.' })),
    );

    await expect(getAssignedDriver()).rejects.toThrow('You have no accepted ride yet.');
  });

  it('shows a connection error when the backend cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(getAssignedDriver()).rejects.toThrow(
      'Could not load driver details. Check your connection and try again.',
    );
  });
});
