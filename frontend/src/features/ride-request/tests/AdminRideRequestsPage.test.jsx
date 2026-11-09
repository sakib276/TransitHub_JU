import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AdminRideRequestsPage from "../pages/AdminRideRequestsPage";

describe("AdminRideRequestsPage", () => {
  it("renders all ride requests initially", () => {
    render(<AdminRideRequestsPage />);

    expect(screen.getByText("Ride Request Administration")).toBeInTheDocument();

    
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#104")).toBeInTheDocument();
  });

  it("filters requests by status", () => {
    render(<AdminRideRequestsPage />);

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "Accepted" },
    });

    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.queryByText("#101")).not.toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
  });

  it("filters requests by user name", () => {
    render(<AdminRideRequestsPage />);

    fireEvent.change(screen.getByPlaceholderText(/search passenger/i), {
      target: { value: "Sadia" },
    });

    expect(screen.getByText("#104")).toBeInTheDocument();
    expect(screen.queryByText("#101")).not.toBeInTheDocument();
  });

  it("shows empty message when no requests match filters", () => {
    render(<AdminRideRequestsPage />);

    fireEvent.change(screen.getByPlaceholderText(/search passenger/i), {
      target: { value: "Unknown User" },
    });

    expect(
      screen.getByText(/no ride requests match the selected filters/i)
    ).toBeInTheDocument();
  });

  it("shows unauthorized action warning", () => {
    render(<AdminRideRequestsPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /unauthorized action/i })
    );

    expect(
      screen.getByText(/unauthorized action blocked and logged/i)
    ).toBeInTheDocument();
  });

  it("shows data failure message", () => {
    render(<AdminRideRequestsPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /simulate data failure/i })
    );

    expect(
      screen.getByText(/unable to load ride data/i)
    ).toBeInTheDocument();
  });
});