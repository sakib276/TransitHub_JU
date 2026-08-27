import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RideForm from "../components/RideForm";

const mockRideData = {
  pickup: "",
  destination: "",
  date: "2026-08-25",
  time: "21:30",
  seats: 2,
  gender: "",
  rideType: "shared",
  notes: "",
  fare: 0,
  travelTime: 0,
};

const mockProps = {
  rideData: mockRideData,
  setRideData: vi.fn(),
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

describe("RideForm Component", () => {
  it("renders pickup and destination fields", () => {
    render(<RideForm {...mockProps} />);

    expect(
      screen.getByLabelText("Pickup Point")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Destination")
    ).toBeInTheDocument();
  });

  it("renders seat input", () => {
    render(<RideForm {...mockProps} />);

    expect(
      screen.getByLabelText("Seats")
    ).toBeInTheDocument();
  });

  it("renders Request Ride button", () => {
    render(<RideForm {...mockProps} />);

    expect(
      screen.getByRole("button", {
        name: /request ride/i,
      })
    ).toBeInTheDocument();
  });
});