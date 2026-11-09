import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Replace the real database pool with a fake one, so tests don't need MySQL.
vi.mock('../../../config/database.js', () => ({
  db: { query: vi.fn() },
}));

const { db } = await import('../../../config/database.js');
const { default: app } = await import('../../../app.js');

const TEST_SECRET = 'test-secret-that-is-at-least-32-characters-long';

/**
 * Creates a token the same way the login backend (feature/registration-login) does.
 *
 * @param {number} userId - users.user_id
 * @param {string} role - users.role
 * @param {string} [secret] - Secret used to sign the token.
 * @returns {string} Signed JWT.
 */
function makeToken(userId, role, secret = TEST_SECRET) {
  return jwt.sign({ sub: userId, role }, secret, { expiresIn: '8h', issuer: 'transithub-ju' });
}

// A row like the one MySQL returns for Nusrat (user 2) with the demo data.
const NUSRAT_ROW = {
  request_id: 1,
  trip_id: 1,
  trip_status: 'Scheduled',
  departure_time: '2026-10-05 08:00:00',
  route_name: 'Main Gate - Central Library',
  pickup_stop: 'Main Gate',
  drop_stop: 'Central Library',
  driver_name: 'Karim Mia',
  driver_phone: '01700000004',
  driver_photo: 'photos/karim.jpg',
  vehicle_number: 'JU-BUS-01',
  vehicle_type: 'Bus',
  total_seats: 40,
};

const URL = '/api/driver-vehicle/assigned-driver';

describe('GET /api/driver-vehicle/assigned-driver', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    db.query.mockReset();
  });

  it('returns the assigned driver and vehicle for a logged-in passenger', async () => {
    db.query.mockResolvedValue([[NUSRAT_ROW]]);

    const response = await request(app)
      .get(URL)
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      requestId: 1,
      tripId: 1,
      tripStatus: 'Scheduled',
      departureTime: '2026-10-05 08:00:00',
      routeName: 'Main Gate - Central Library',
      pickupStop: 'Main Gate',
      dropStop: 'Central Library',
      driverName: 'Karim Mia',
      driverPhone: '01700000004',
      driverPhoto: 'photos/karim.jpg',
      vehicleNumber: 'JU-BUS-01',
      vehicleType: 'Bus',
      totalSeats: 40,
    });
  });

  it('looks up the ride using the user id from the token', async () => {
    db.query.mockResolvedValue([[NUSRAT_ROW]]);

    await request(app).get(URL).set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`);

    const [sql, params] = db.query.mock.calls[0];
    expect(params).toEqual([2]);
    expect(sql).toContain("rr.status = 'Approved'");
    expect(sql).toContain("t.trip_status IN ('Scheduled', 'Running')");
  });

  it('returns 404 when the passenger has no accepted ride', async () => {
    db.query.mockResolvedValue([[]]);

    const response = await request(app)
      .get(URL)
      .set('Authorization', `Bearer ${makeToken(3, 'Passenger')}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('You have no accepted ride yet.');
  });

  it('returns 401 when no token is sent', async () => {
    const response = await request(app).get(URL);

    expect(response.status).toBe(401);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('returns 401 when the token was signed with a different secret', async () => {
    const response = await request(app)
      .get(URL)
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger', 'some-other-secret-of-32-characters!!')}`);

    expect(response.status).toBe(401);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('returns 403 when the logged-in user is not a passenger', async () => {
    const response = await request(app)
      .get(URL)
      .set('Authorization', `Bearer ${makeToken(4, 'Driver')}`);

    expect(response.status).toBe(403);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('returns 500 when the database fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValue(new Error('connect ECONNREFUSED'));

    const response = await request(app)
      .get(URL)
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Could not load driver details. Please try again.');
  });
});
