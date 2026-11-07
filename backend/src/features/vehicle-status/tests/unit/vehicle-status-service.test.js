/**
 * Unit tests for the vehicle status business logic service.
 *
 * These tests verify the service layer independently from the HTTP,
 * controller, and database layers. Repository methods are mocked
 * to isolate and validate the business rules implemented by the service.
 *
 * The test suite covers:
 * - Handling drivers without an assigned vehicle.
 * - Preventing status changes for vehicles under maintenance.
 * - Validating the current stand for Available status.
 * - Validating the destination for Busy status.
 * - Automatically setting Busy & Full when no seats are available.
 * - Successfully setting a driver's status to Offline.
 *
 * @module vehicle-status-service.test
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import vehicleStatusService from '../../services/vehicle-status-service.js';
import vehicleStatusRepository from '../../repositories/vehicle-status-repository.js';
import {
  DriverStatus,
  FleetStatus,
} from '../../constants/vehicle-status-constants.js';

/**
 * Test suite for VehicleStatusService business logic.
 *
 * Repository functions are mocked so that the tests focus only on
 * the behavior and validation rules implemented by the service layer.
 */
describe('VehicleStatusService (Unit Tests)', () => {
  /**
   * Represents a valid active vehicle assigned to a driver.
   *
   * @type {Object}
   */
  const mockActiveVehicle = {
    vehicleId: 1,
    driverId: 2,
    plateNumber: 'DHAKA-METRO-JU-101',
    capacity: 4,
    availableSeats: 4,
    fleetStatus: FleetStatus.ACTIVE,
    driverStatus: DriverStatus.OFFLINE,
    currentLocationId: null,
    destinationLocationId: null,
  };

  /**
   * Restores all Vitest mocks before each test to prevent
   * mocked behavior from affecting other test cases.
   */
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Verifies that the service rejects a status request when
   * the specified driver does not have an assigned vehicle.
   */
  it('should throw an error when vehicle is not found for driver', async () => {
    vi.spyOn(vehicleStatusRepository, 'findVehicleByDriverId')
      .mockResolvedValue(null);

    await expect(
      vehicleStatusService.getDriverStatus(99)
    ).rejects.toThrow('No vehicle assigned to this driver.');
  });

  /**
   * Verifies that drivers cannot change vehicle status while
   * the vehicle is under maintenance.
   */
  it('should throw an error if vehicle is Under Maintenance', async () => {
    const maintenanceVehicle = {
      ...mockActiveVehicle,
      fleetStatus: FleetStatus.UNDER_MAINTENANCE,
    };

    vi.spyOn(vehicleStatusRepository, 'findVehicleByDriverId')
      .mockResolvedValue(maintenanceVehicle);

    await expect(
      vehicleStatusService.changeDriverStatus(2, {
        driverStatus: DriverStatus.AVAILABLE,
        currentLocationId: 1,
      })
    ).rejects.toThrow(
      'Cannot update status. Vehicle is currently Under Maintenance.'
    );
  });

  /**
   * Verifies that Available status requires a valid current stand.
   */
  it('should reject Available status if current stand is missing', async () => {
    vi.spyOn(vehicleStatusRepository, 'findVehicleByDriverId')
      .mockResolvedValue(mockActiveVehicle);

    await expect(
      vehicleStatusService.changeDriverStatus(2, {
        driverStatus: DriverStatus.AVAILABLE,
        currentLocationId: null,
      })
    ).rejects.toThrow('Please select your current stand.');
  });

  /**
   * Verifies that Busy status requires a route destination.
   */
  it('should reject Busy status if route destination is missing', async () => {
    vi.spyOn(vehicleStatusRepository, 'findVehicleByDriverId')
      .mockResolvedValue(mockActiveVehicle);

    await expect(
      vehicleStatusService.changeDriverStatus(2, {
        driverStatus: DriverStatus.BUSY,
        destinationLocationId: null,
      })
    ).rejects.toThrow('Please select your route destination.');
  });

  /**
   * Verifies the business rule that a vehicle with zero available
   * seats is automatically assigned the Busy & Full status.
   *
   * Also verifies that the repository receives the expected
   * updated vehicle status and location information.
   */
  it('should automatically set status to Busy & Full when available seats reach 0', async () => {
    vi.spyOn(vehicleStatusRepository, 'findVehicleByDriverId')
      .mockResolvedValue(mockActiveVehicle);

    const updateSpy = vi.spyOn(
      vehicleStatusRepository,
      'updateDriverStatus'
    ).mockResolvedValue(true);

    await vehicleStatusService.changeDriverStatus(2, {
      driverStatus: DriverStatus.BUSY,
      destinationLocationId: 3,
      availableSeats: 0,
    });

    expect(updateSpy).toHaveBeenCalledWith(2, {
      driverStatus: DriverStatus.BUSY_AND_FULL,
      currentLocationId: null,
      destinationLocationId: 3,
      availableSeats: 0,
    });
  });

  /**
   * Verifies that a driver can successfully change their status
   * to Offline and that active route/location information is cleared.
   */
  it('should successfully set status to Offline', async () => {
    vi.spyOn(vehicleStatusRepository, 'findVehicleByDriverId')
      .mockResolvedValue(mockActiveVehicle);

    const updateSpy = vi.spyOn(
      vehicleStatusRepository,
      'updateDriverStatus'
    ).mockResolvedValue(true);

    await vehicleStatusService.changeDriverStatus(2, {
      driverStatus: DriverStatus.OFFLINE,
    });

    expect(updateSpy).toHaveBeenCalledWith(2, {
      driverStatus: DriverStatus.OFFLINE,
      currentLocationId: null,
      destinationLocationId: null,
      availableSeats: 0,
    });
  });
});
