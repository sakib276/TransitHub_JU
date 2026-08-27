import { describe, expect, it } from 'vitest';

import {
  VEHICLE_STATUS,
  validateVehicleStatus,
} from '../services/vehicle-status-service';

describe('validateVehicleStatus', () => {
  it('accepts available status with a selected stand', () => {
    const result = validateVehicleStatus(
      VEHICLE_STATUS.AVAILABLE,
      'cse',
    );

    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('rejects available status without a stand', () => {
    const result = validateVehicleStatus(
      VEHICLE_STATUS.AVAILABLE,
      '',
    );

    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      'Please select your current stand.',
    );
  });

  it('accepts busy status without a stand', () => {
    const result = validateVehicleStatus(
      VEHICLE_STATUS.BUSY,
      '',
    );

    expect(result.valid).toBe(true);
  });

  it('accepts offline status without a stand', () => {
    const result = validateVehicleStatus(
      VEHICLE_STATUS.OFFLINE,
      '',
    );

    expect(result.valid).toBe(true);
  });

  it('rejects an empty vehicle status', () => {
    const result = validateVehicleStatus('', '');

    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      'Please select a vehicle status.',
    );
  });
});