import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TripHistoryCard from "./TripHistoryCard";

const trip = {
  historyId: 1,
  tripId: 101,
  pickup: "Main Gate",
  destination: "Central Library",
  farePaid: 40,
  driverName: "Rahim",
  rideType: "Regular",
  status: "Completed",
  completedAt: "2026-08-30T15:30:00",
};

describe("TripHistoryCard", () => {
  it("displays trip information", () => {
    render(<TripHistoryCard trip={trip} />);

    expect(screen.getByText("Main Gate")).toBeInTheDocument();
    expect(screen.getByText("Central Library")).toBeInTheDocument();
    expect(screen.getByText("Rahim")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});