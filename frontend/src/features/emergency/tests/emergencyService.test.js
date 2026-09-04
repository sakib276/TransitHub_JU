import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  coordinateResponse,
  getEmergencyAlerts,
  reportEmergency,
} from '../services/emergencyService';

describe('reportEmergency', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('saves and returns the alert when the send succeeds', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const resultPromise = reportEmergency({
      role: 'passenger',
      reporterName: 'Anika Rahman',
      contact: '01711-000000',
      tripId: 'TRIP-1',
    });
    await vi.runAllTimersAsync();
    const alert = await resultPromise;

    expect(alert).toMatchObject({
      role: 'passenger',
      reporterName: 'Anika Rahman',
      contact: '01711-000000',
      tripId: 'TRIP-1',
      status: 'New',
    });
    expect(alert.id).toBeDefined();
    expect(alert.location).toBeTruthy();
  });

  it('throws an error to simulate an occasional network failure', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const resultPromise = reportEmergency({
      role: 'driver',
      reporterName: 'Karim Mia',
      contact: '01911-000000',
      tripId: 'TRIP-2',
      vehiclePlate: 'JU-RIK-101',
    });
    const assertion = expect(resultPromise).rejects.toThrow(
      'Could not send emergency alert. Check your connection and try again.',
    );

    await vi.runAllTimersAsync();
    await assertion;
  });
});

describe('getEmergencyAlerts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns the reported alerts, most recent first', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const firstPromise = reportEmergency({
      role: 'passenger',
      reporterName: 'Anika Rahman',
      contact: '01711-000000',
      tripId: 'TRIP-1',
    });
    await vi.runAllTimersAsync();
    await firstPromise;

    const secondPromise = reportEmergency({
      role: 'driver',
      reporterName: 'Karim Mia',
      contact: '01911-000000',
      tripId: 'TRIP-2',
      vehiclePlate: 'JU-RIK-101',
    });
    await vi.runAllTimersAsync();
    await secondPromise;

    const alertsPromise = getEmergencyAlerts();
    await vi.runAllTimersAsync();
    const alerts = await alertsPromise;

    expect(alerts.length).toBeGreaterThanOrEqual(2);
    expect(alerts[0].tripId).toBe('TRIP-2');
  });

  it('throws an error to simulate a dropped connection', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const resultPromise = getEmergencyAlerts();
    const assertion = expect(resultPromise).rejects.toThrow(
      'Lost connection to the alert feed. Reconnecting...',
    );

    await vi.runAllTimersAsync();
    await assertion;
  });
});

describe('coordinateResponse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('updates the status of an existing alert', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const reportPromise = reportEmergency({
      role: 'passenger',
      reporterName: 'Anika Rahman',
      contact: '01711-000000',
      tripId: 'TRIP-3',
    });
    await vi.runAllTimersAsync();
    const alert = await reportPromise;

    const updatePromise = coordinateResponse(alert.id, 'Coordinating');
    await vi.runAllTimersAsync();
    const updated = await updatePromise;

    expect(updated.status).toBe('Coordinating');
  });

  it('throws when the alert cannot be found', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const resultPromise = coordinateResponse(999999, 'Resolved');
    const assertion = expect(resultPromise).rejects.toThrow('Alert details unavailable.');

    await vi.runAllTimersAsync();
    await assertion;
  });
});
