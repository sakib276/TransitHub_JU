import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DriverQueuePage from "../pages/DriverQueuePage";

describe("DriverQueuePage", () => {
  beforeEach(() => {
    render(<DriverQueuePage />);
  });

  it("renders all waiting passengers", () => {
    expect(screen.getByText("Anika")).toBeInTheDocument();
    expect(screen.getByText("Nafis")).toBeInTheDocument();
    expect(screen.getByText("Sadia")).toBeInTheDocument();
  });

  it("assigns a seat and updates available seats", () => {
    fireEvent.click(screen.getAllByRole("button", { name: /assign seat/i })[0]);

    expect(
      screen.getByText(/Anika has been assigned 1 seat/i)
    ).toBeInTheDocument();

    expect(screen.queryByText("Anika")).not.toBeInTheDocument();
    expect(screen.getByText(/Available seats:\s*1/i)).toBeInTheDocument();
  });

  it("prevents assigning when seats are insufficient", () => {
    // Assign Anika first (2 → 1 seat)
    fireEvent.click(screen.getAllByRole("button", { name: /assign seat/i })[0]);

    const assignButtons = screen.getAllByRole("button", {
      name: /assign seat/i,
    });

    // Nafis requires 2 seats, so his button should be disabled
    expect(assignButtons[0]).toBeDisabled();

    // Passenger remains in queue
    expect(screen.getByText("Nafis")).toBeInTheDocument();

    // Seat count remains 1
    expect(screen.getByText(/Available seats:\s*1/i)).toBeInTheDocument();
  });

  it("marks a passenger as no-show and removes them", () => {
    fireEvent.click(screen.getAllByRole("button", { name: /no-show/i })[2]);

    expect(
      screen.getByText(/Sadia was marked as no-show/i)
    ).toBeInTheDocument();

    expect(screen.queryByText("Sadia")).not.toBeInTheDocument();
  });

  it("shows empty state when all passengers are removed", () => {
    fireEvent.click(screen.getAllByRole("button", { name: /no-show/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /no-show/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /no-show/i })[0]);

    expect(
      screen.getByText(/No one is waiting at JU Gate/i)
    ).toBeInTheDocument();
  });

  it("disables assign button when passenger needs more seats than available", () => {
    fireEvent.click(screen.getAllByRole("button", { name: /assign seat/i })[0]);

    const assignButtons = screen.getAllByRole("button", {
      name: /assign seat/i,
    });

    expect(assignButtons[0]).toBeDisabled();
  });
});