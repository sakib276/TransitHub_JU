import { describe, it, expect } from "vitest";
import { validateRequest } from "../services/rideRequestService";

describe("validateRequest", () => {

  const validRequest = {
    pickup: "JU Gate",
    destination: "Transport",
    seats: 2,
  };


  it("returns Valid for a valid ride request", () => {
    expect(validateRequest(validRequest)).toBe("Valid");
  });


  it("rejects request when an active request already exists", () => {
    expect(
      validateRequest(validRequest, true)
    ).toBe("Active request already exists");
  });


  it("rejects request when pickup is missing", () => {
    const request = {
      ...validRequest,
      pickup: "",
    };

    expect(
      validateRequest(request)
    ).toBe("Pickup and destination are required");
  });


  it("rejects request when destination is missing", () => {
    const request = {
      ...validRequest,
      destination: "",
    };

    expect(
      validateRequest(request)
    ).toBe("Pickup and destination are required");
  });


  it("rejects request when seat count is less than 1", () => {
    const request = {
      ...validRequest,
      seats: 0,
    };

    expect(
      validateRequest(request)
    ).toBe("Seat count must be at least 1");
  });


  it("rejects pickup outside the service area", () => {
    const request = {
      ...validRequest,
      pickup: "Outside Campus",
    };

    expect(
      validateRequest(request)
    ).toBe("Outside service area");
  });


  it("rejects destination outside the service area", () => {
    const request = {
      ...validRequest,
      destination: "Outside Campus",
    };

    expect(
      validateRequest(request)
    ).toBe("Outside service area");
  });

});