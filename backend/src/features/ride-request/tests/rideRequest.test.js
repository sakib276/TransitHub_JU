import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Replace the model (database code) with fakes, so tests don't need MySQL.
vi.mock('../rideRequest.model.js', () => ({
  findRouteOptions: vi.fn(),
  createApprovedRideRequest: vi.fn(),
}));

const model = await import('../rideRequest.model.js');
const { default: app } = await import('../../../app.js');

const TEST_SECRET = 'test-secret-that-is-at-least-32-characters-long';

/**
 * Creates a token the same way the login feature does.
 *
 * @param {number} userId - users.user_id
 * @param {string} role - users.role
 * @returns {string} Signed JWT.
 */
function makeToken(userId, role) {
  return jwt.sign({ sub: userId, role }, TEST_SECRET, { expiresIn: '8h', issuer: 'transithub-ju' });
}

describe('GET /api/ride-requests/route-options', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    vi.resetAllMocks();
  });

  it('returns stop pairs with fare and travel time from the database', async () => {
    model.findRouteOptions.mockResolvedValue([
      { pickup_stop: 'Main Gate', drop_stop: 'Central Library', route_name: 'Main Gate - Central Library', fare: '20.00', estimated_time: 10 },
    ]);

    const response = await request(app)
      .get('/api/ride-requests/route-options')
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      { pickupStop: 'Main Gate', dropStop: 'Central Library', routeName: 'Main Gate - Central Library', fare: 20, travelTime: 10 },
    ]);
  });

  it('returns 401 when not logged in', async () => {
    const response = await request(app).get('/api/ride-requests/route-options');

    expect(response.status).toBe(401);
  });
});

describe('POST /api/ride-requests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    vi.resetAllMocks();
  });

  it('saves the request for the logged-in passenger and returns the assigned trip', async () => {
    model.createApprovedRideRequest.mockResolvedValue({ requestId: 4, tripId: 2 });

    const response = await request(app)
      .post('/api/ride-requests')
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`)
      .send({ pickupStop: 'Main Gate', dropStop: 'Muktomancho' });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({ requestId: 4, tripId: 2 });
    expect(model.createApprovedRideRequest).toHaveBeenCalledWith(2, 'Main Gate', 'Muktomancho');
  });

  it('returns 409 when no trip has a free seat for the route', async () => {
    model.createApprovedRideRequest.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/ride-requests')
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`)
      .send({ pickupStop: 'Central Library', dropStop: 'Main Gate' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('No vehicle with a free seat is available for this route right now.');
  });

  it('returns 400 when pickup and destination are the same', async () => {
    const response = await request(app)
      .post('/api/ride-requests')
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`)
      .send({ pickupStop: 'Main Gate', dropStop: 'Main Gate' });

    expect(response.status).toBe(400);
    expect(model.createApprovedRideRequest).not.toHaveBeenCalled();
  });

  it('returns 400 when pickup or destination is missing', async () => {
    const response = await request(app)
      .post('/api/ride-requests')
      .set('Authorization', `Bearer ${makeToken(2, 'Passenger')}`)
      .send({ pickupStop: 'Main Gate' });

    expect(response.status).toBe(400);
  });

  it('returns 403 when a driver tries to request a ride', async () => {
    const response = await request(app)
      .post('/api/ride-requests')
      .set('Authorization', `Bearer ${makeToken(4, 'Driver')}`)
      .send({ pickupStop: 'Main Gate', dropStop: 'Central Library' });

    expect(response.status).toBe(403);
    expect(model.createApprovedRideRequest).not.toHaveBeenCalled();
  });
});
