// @vitest-environment jsdom
/**
 * @fileoverview Service layer unit tests for fare calculations and caching.
 * @module features/fare/tests/fareService.test
 * @author Nazmus Sakib
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fareService, PREDEFINED_FARE_MATRIX } from '../services/fareService';

describe('fareService Unit Tests (FR-5)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('calculates fare correctly for direct and reverse matching routes', () => {
    const directResult = fareService.calculateFare('CSE', 'Dairy Gate');
    expect(directResult.hasMatchingRoute).toBe(true);
    expect(directResult.rickshawFare).toBe(20);
    expect(directResult.cartFare).toBe(10);

    const reverseResult = fareService.calculateFare('Dairy Gate', 'CSE');
    expect(reverseResult.hasMatchingRoute).toBe(true);
    expect(reverseResult.rickshawFare).toBe(20);
    expect(reverseResult.cartFare).toBe(10);
  });

  it('rejects identical pickup and destination selection', () => {
    const result = fareService.calculateFare('CSE', 'CSE');
    expect(result.hasMatchingRoute).toBe(false);
    expect(result.isSameLocationSelected).toBe(true);
  });

  it('retrieves fare list and caches it in localStorage for offline support', async () => {
    const response = await fareService.getFareChart();
    expect(response.isSuccessful).toBe(true);
    expect(response.fareChartData.length).toBe(PREDEFINED_FARE_MATRIX.length);

    const cached = localStorage.getItem('transithub_ju_fare_chart');
    expect(cached).not.toBeNull();
  });

  it('stores overcharge complaint successfully in localStorage', async () => {
    const payload = {
      vehicleIdentifier: 'Auto 10',
      chargedFareAmount: 40,
      incidentDetails: 'High fare charged'
    };

    const reportRes = await fareService.reportOvercharge(payload);
    expect(reportRes.isSuccessful).toBe(true);

    const complaints = await fareService.getComplaints();
    expect(complaints.length).toBe(1);
    expect(complaints[0].vehicleIdentifier).toBe('Auto 10');
  });
});