import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../services/ride-request-service.js", () => ({
  acceptRideRequest: vi.fn(),
  createRideRequest: vi.fn(),
  getDrivers: vi.fn(),
  getDriverVehicle: vi.fn(),
  getLocations: vi.fn(),
  getRideRequests: vi.fn(),
  rejectRideRequest: vi.fn(),
  setDriverStatus: vi.fn(),
}));

import app from "../../../app.js";
import * as rideRequestService from "../services/ride-request-service.js";

describe("ride-request routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns database locations", async () => {
    rideRequestService.getLocations.mockResolvedValue([
      { id: 1, name: "JU Gate" },
    ]);

    const response = await request(app).get("/api/locations");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: 1, name: "JU Gate" }]);
  });

  it("publishes the OpenAPI definition and registered API operations", async () => {
    const response = await request(app).get("/api-docs/swagger.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths["/api/locations"].get).toBeDefined();
    expect(response.body.paths["/api/ride-requests"].post).toBeDefined();
    expect(response.body.paths["/api/ride-requests/{id}/accept"].post).toBeDefined();
  });

  it("serves the Swagger UI page", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });

  it("returns validation failures as client errors", async () => {
    const validationError = new Error("Passenger ID must be a positive integer.");
    validationError.code = "INVALID_ID";
    rideRequestService.createRideRequest.mockRejectedValue(validationError);

    const response = await request(app)
      .post("/api/ride-requests")
      .send({ passengerId: 0 });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: "INVALID_ID",
      message: "Passenger ID must be a positive integer.",
    });
  });

  it("creates requests using the service and returns 201", async () => {
    const queueEntry = { id: 51, status: "Waiting", token: "RQ-test" };
    rideRequestService.createRideRequest.mockResolvedValue(queueEntry);

    const response = await request(app)
      .post("/api/ride-requests")
      .send({ passengerId: 5, pickupLocationId: 1, destinationLocationId: 2 });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(queueEntry);
    expect(rideRequestService.createRideRequest).toHaveBeenCalledWith(
      expect.objectContaining({ passengerId: 5, pickupLocationId: 1 })
    );
  });

  it("surfaces unexpected database failures as server errors", async () => {
    rideRequestService.getLocations.mockRejectedValue(new Error("database offline"));

    const response = await request(app).get("/api/locations");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Ride request operation failed.");
  });
});
