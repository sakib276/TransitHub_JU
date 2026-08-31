import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TripHistory from "./TripHistory";
import { getTripHistory } from "../tripHistoryApi";

vi.mock("../tripHistoryApi", () => ({
  getTripHistory: vi.fn(),
}));

const mockTrips = [
  {
    historyId: 1,
    tripId: 101,
    pickup: "Main Gate",
    destination: "Central Library",
    farePaid: 40,
    driverName: "Rahim",
    rideType: "Regular",
    status: "Completed",
    completedAt: "2026-08-30T15:30:00",
  },
  {
    historyId: 2,
    tripId: 102,
    pickup: "Dairy Gate",
    destination: "JU Bot Tola",
    farePaid: 30,
    driverName: "Karim",
    rideType: "Shared",
    status: "Completed",
    completedAt: "2026-08-29T12:00:00",
  },
];

describe("TripHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    getTripHistory.mockReturnValue(new Promise(() => {}));

    render(<TripHistory />);

    expect(
      screen.getByText("Loading trip history...")
    ).toBeInTheDocument();
  });

  it("displays trip history", async () => {
    getTripHistory.mockResolvedValue(mockTrips);

    render(<TripHistory />);

    expect(
      await screen.findByText("Central Library")
    ).toBeInTheDocument();

    expect(
      screen.getByText("JU Bot Tola")
    ).toBeInTheDocument();
  });

  it("shows empty state when no history exists", async () => {
    getTripHistory.mockResolvedValue([]);

    render(<TripHistory />);

    expect(
      await screen.findByText("No trip history available.")
    ).toBeInTheDocument();
  });

  it("shows error when loading fails", async () => {
    getTripHistory.mockRejectedValue(
      new Error("Network error")
    );

    render(<TripHistory />);

    expect(
      await screen.findByText(
        "Unable to load trip history. Please try again."
      )
    ).toBeInTheDocument();
  });
});