/**
 * @file availableVehicles.test.js
 * @description Vitest suite for the available vehicles endpoint.
 */

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import * as vehicleService from './availableVehicles.service.js';

describe('Available Vehicles Feature', () => {
  it('returns 200 and available vehicle records', async () => {
    const mockList = [
      { id: 1, name: 'Bus Campus Express 01', status: 'available' },
      { id: 2, name: 'Microbus JU-02', status: 'available' }
    ];

    // Mock DB layer so test runs independently of MySQL server status
    vi.spyOn(vehicleService, 'getAvailableVehiclesFromDB').mockResolvedValue(mockList);

    const res = await request(app).get('/api/vehicles/available');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toEqual(mockList);
  });

  it('returns 500 when database fails', async () => {
    vi.spyOn(vehicleService, 'getAvailableVehiclesFromDB').mockRejectedValue(new Error('Connection lost'));

    const res = await request(app).get('/api/vehicles/available');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});