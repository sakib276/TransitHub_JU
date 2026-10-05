
/**
 * Integration tests for the Driver Vehicle Status HTTP API.
 *
 * These tests verify the complete API flow from HTTP request through
 * the application layers to the database and back to the HTTP response.
 *
 * The tests cover retrieving driver status, retrieving active locations,
 * validating status updates, successful status changes, automatic
 * Busy & Full status handling, and invalid driver handling.
 *
 * @module vehicle-status.test
 */

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';

/**
 * Test suite for Driver Vehicle Status API (FR-7.1).
 *
 * Supertest sends HTTP requests to the Express application without
 * starting a separate server. The requests pass through the actual
 * route, controller, service, repository, and database layers.
 */
describe('Driver Vehicle Status API (Integration Tests - FR-7.1)', () => {
  /**
   * Verifies that the current vehicle status of an existing driver
   * can be retrieved successfully.
   */
  it('GET /api/v1/vehicles/driver/status - should fetch current driver status', async () => {
    const response = await request(app)
      .get('/api/v1/vehicles/driver/status?driverId=2');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('driverStatus');
  });

  /**
   * Verifies that all active vehicle stands/locations are returned
   * successfully for use when updating the driver's current location.
   */
  it('GET /api/v1/vehicles/locations - should retrieve all active stands', async () => {
    const response = await request(app)
      .get('/api/v1/vehicles/locations');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  /**
   * Verifies that the API rejects an Available status update when
   * the driver does not provide a current stand.
   *
   * According to the business rule, a driver must select a current
   * stand before changing the vehicle status to Available.
   */
  it('PUT /api/v1/vehicles/driver/status - should reject Available status when current stand is missing', async () => {
    const response = await request(app)
      .put('/api/v1/vehicles/driver/status')
      .send({
        driverId: 2,
        driverStatus: 'Available',
        currentLocationId: null,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Please select your current stand.');
  });

  /**
   * Verifies that a driver can successfully change the vehicle
   * status to Available when a valid current stand is provided.
   */
  it('PUT /api/v1/vehicles/driver/status - should successfully update status to Available with stand', async () => {
    const response = await request(app)
      .put('/api/v1/vehicles/driver/status')
      .send({
        driverId: 2,
        driverStatus: 'Available',
        currentLocationId: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.driverStatus).toBe('Available');
    expect(response.body.data.currentLocationId).toBe(1);
  });

  /**
   * Verifies that the vehicle status is automatically changed to
   * Busy & Full when the available seat count reaches zero.
   */
  it('PUT /api/v1/vehicles/driver/status - should update to Busy & Full when available seats are 0', async () => {
    const response = await request(app)
      .put('/api/v1/vehicles/driver/status')
      .send({
        driverId: 2,
        driverStatus: 'Busy',
        destinationLocationId: 3,
        availableSeats: 0,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.driverStatus).toBe('Busy & Full');
  });

  /**
   * Verifies that the API returns a 404 error when the requested
   * driver does not have an assigned vehicle.
   */
  it('GET /api/v1/vehicles/driver/status - should return 404 for non-existent driver vehicle', async () => {
    const response = await request(app)
      .get('/api/v1/vehicles/driver/status?driverId=99999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
