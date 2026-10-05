import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/ride-request-model.js", () => ({
  assignRideRequest: vi.fn(),
  cancelRideRequest: vi.fn(),
  findActiveLocations: vi.fn(),
  findAvailableDrivers: vi.fn(),
  findDriverVehicle: vi.fn(),
  findRideRequests: vi.fn(),
  insertRideRequest: vi.fn(),
  rejectDriverOffer: vi.fn(),
  updateDriverStatus: vi.fn(),
}));

import * as rideRequestModel from "../models/ride-request-model.js";
import {
  acceptRideRequest,
  createRideRequest,
  getDrivers,
  getRideRequests,
  rejectRideRequest,
  setDriverStatus,
} from "../services/ride-request-service.js";

const VALID_REQUEST = {
  passengerId: 7,
  pickupLocationId: 1,
  destinationLocationId: 2,
  seatsNeeded: 2,
  genderPreference: "Any",
};

describe("ride-request service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates queue entries with normalized optional fields", async () => {
    rideRequestModel.insertRideRequest.mockResolvedValue({ id: 12 });

    await expect(createRideRequest(VALID_REQUEST)).resolves.toEqual({ id: 12 });
    expect(rideRequestModel.insertRideRequest).toHaveBeenCalledWith({
      ...VALID_REQUEST,
      priority: false,
      priorityReason: "Other",
    });
  });

  it.each([
    [{ ...VALID_REQUEST, passengerId: "invalid" }, "Passenger ID must be a positive integer."],
    [{ ...VALID_REQUEST, pickupLocationId: 2 }, "Pickup and destination must be different."],
    [{ ...VALID_REQUEST, seatsNeeded: 5 }, "Seat count must be an integer between 1 and 4."],
    [{ ...VALID_REQUEST, genderPreference: "Unknown" }, "Gender preference must be Any, Male, or Female."],
    [
      { ...VALID_REQUEST, priority: true, priorityReason: "Urgent" },
      "Priority reason is invalid.",
    ],
  ])("rejects invalid queue data", async (request, message) => {
    await expect(createRideRequest(request)).rejects.toThrow(message);
    expect(rideRequestModel.insertRideRequest).not.toHaveBeenCalled();
  });

  it("rejects invalid seat counts when searching drivers", async () => {
    await expect(getDrivers("0")).rejects.toThrow(
      "Seat count must be an integer between 1 and 4."
    );
    expect(rideRequestModel.findAvailableDrivers).not.toHaveBeenCalled();
  });

  it("passes valid status filters to the queue model", async () => {
    rideRequestModel.findRideRequests.mockResolvedValue([]);

    await getRideRequests({ status: "Waiting", passengerId: "7" });

    expect(rideRequestModel.findRideRequests).toHaveBeenCalledWith({
      status: "Waiting",
      passengerId: 7,
      driverId: undefined,
    });
  });

  it("rejects unknown request statuses", async () => {
    await expect(getRideRequests({ status: "Searching" })).rejects.toThrow(
      "Ride request status is invalid."
    );
  });

  it("assigns only valid driver, vehicle, and seat IDs", async () => {
    rideRequestModel.assignRideRequest.mockResolvedValue({ id: 45 });

    await expect(
      acceptRideRequest("19", {
        driverId: "4",
        vehicleId: "9",
        seatsAssigned: "2",
      })
    ).resolves.toEqual({ id: 45 });

    expect(rideRequestModel.assignRideRequest).toHaveBeenCalledWith({
      rideRequestId: 19,
      driverId: 4,
      vehicleId: 9,
      seatsAssigned: 2,
    });
  });

  it("records driver declines without cancelling the queue entry", async () => {
    await rejectRideRequest("19", "4");

    expect(rideRequestModel.rejectDriverOffer).toHaveBeenCalledWith(19, 4);
    expect(rideRequestModel.cancelRideRequest).not.toHaveBeenCalled();
  });

  it("updates only supported driver operational statuses", async () => {
    await expect(setDriverStatus("4", "9", "Available")).resolves.toEqual({
      driverId: 4,
      vehicleId: 9,
      status: "Available",
    });

    await expect(setDriverStatus(4, 9, "Busy")).rejects.toThrow(
      "Driver status must be Available or Offline."
    );
  });
});
