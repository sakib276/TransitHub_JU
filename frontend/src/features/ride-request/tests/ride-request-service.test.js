import { describe, it, expect } from "vitest";
import { validateRequest } from "../services/ride-request-service";

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
    ).toBe("Seat count must be between 1 and 4");
  });

  it("rejects pickup outside the active locations", () => {
    const request = {
      ...validRequest,
      pickup: "Outside Campus",
    };

    expect(
      validateRequest(request, false, ["JU Gate", "Transport"])
    ).toBe("Outside service area");
  });


  it("rejects destination outside the active locations", () => {
    const request = {
      ...validRequest,
      destination: "Outside Campus",
    };

    expect(
      validateRequest(request, false, ["JU Gate", "Transport"])
    ).toBe("Outside service area");
  });

});