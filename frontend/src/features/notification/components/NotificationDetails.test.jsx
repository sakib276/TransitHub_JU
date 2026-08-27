import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

import NotificationDetails from "./NotificationDetails";

describe("NotificationDetails", () => {
  const mockNotification = {
    id: 1,
    type: "driver_assigned",
    title: "Driver Assigned",
    details: {
      description: "A driver has been assigned to your ride.",
      dateTime: "27 August 2026, 10:30 PM",
      relatedRideId: "RIDE-123",
      rideStatus: "Driver Assigned",
    },
  };

  /**
   * Test empty state when no notification is selected.
   */
  it("shows empty-state message when notification is null", () => {
    render(<NotificationDetails notification={null} />);

    expect(
      screen.getByText("Select a notification to see its details.")
    ).toBeInTheDocument();
  });

  /**
   * Test notification details rendering.
   */
  it("renders notification details correctly", () => {
    render(<NotificationDetails notification={mockNotification} />);

    expect(
      screen.getByText("Notification Details")
    ).toBeInTheDocument();

    // Check the notification title specifically as a heading
    expect(
      screen.getByRole("heading", { name: "Driver Assigned" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("A driver has been assigned to your ride.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("27 August 2026, 10:30 PM")
    ).toBeInTheDocument();

    expect(
      screen.getByText("RIDE-123")
    ).toBeInTheDocument();

    // Check the ride status value
    expect(
      screen.getAllByText("Driver Assigned")
    ).toHaveLength(2);
  });

  /**
   * Test correct icon for notification type.
   */
  it("shows the correct icon for driver_assigned notification", () => {
    render(<NotificationDetails notification={mockNotification} />);

    expect(screen.getByText("🚗")).toBeInTheDocument();
  });

  /**
   * Test fallback icon for unknown notification type.
   */
  it("shows default bell icon for unknown notification type", () => {
    const unknownNotification = {
      ...mockNotification,
      type: "unknown_type",
    };

    render(
      <NotificationDetails notification={unknownNotification} />
    );

    expect(screen.getByText("🔔")).toBeInTheDocument();
  });

  /**
   * Test labels in notification details.
   */
  it("renders all detail labels", () => {
    render(<NotificationDetails notification={mockNotification} />);

    expect(
      screen.getByText("Date & Time")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Related Ride ID")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ride Status")
    ).toBeInTheDocument();
  });
});