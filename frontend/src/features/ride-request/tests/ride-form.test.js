import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RideForm from "../components/ride-form";

const mockRideData = {
  pickupLocationId: "",
  destinationLocationId: "",
  seatsNeeded: 2,
  genderPreference: "Any",
};

const mockProps = {
  rideData: mockRideData,
  setRideData: vi.fn(),
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

describe("RideForm Component", () => {
  it("renders pickup and destination fields", () => {
    render(React.createElement(RideForm, mockProps));

    expect(
      screen.getByLabelText("Pickup Point")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Destination")
    ).toBeInTheDocument();
  });

  it("renders seat input", () => {
    render(React.createElement(RideForm, mockProps));

    expect(
      screen.getByLabelText("Seats")
    ).toBeInTheDocument();
  });

  it("renders Request Ride button", () => {
    render(React.createElement(RideForm, mockProps));

    expect(
      screen.getByRole("button", {
        name: /request ride/i,
      })
    ).toBeInTheDocument();
  });

  it("renders locations supplied by the backend", () => {
    render(
      React.createElement(RideForm, {
        ...mockProps,
        locations: [{ id: 17, name: "Dairy Gate" }],
      })
    );

    expect(
      screen.getAllByRole("option", { name: "Dairy Gate" })
    ).toHaveLength(2);
  });
});