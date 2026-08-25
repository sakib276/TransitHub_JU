import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RideForm from "../components/RideForm";

describe("RideForm Component", () => {

  it("renders pickup and destination fields", () => {
    render(<RideForm />);

    expect(screen.getByPlaceholderText("JU Gate")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hall")).toBeInTheDocument();
  });

  it("renders seat input", () => {
    render(<RideForm />);

    expect(screen.getByLabelText("Seats")).toBeInTheDocument();
  });

  it("renders Request Ride button", () => {
    render(<RideForm />);

    expect(screen.getByRole("button", {
      name: /request ride/i,
    })).toBeInTheDocument();
  });

});