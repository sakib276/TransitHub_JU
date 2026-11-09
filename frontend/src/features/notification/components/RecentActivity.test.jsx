import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

import RecentActivity from "./RecentActivity";

describe("RecentActivity", () => {
  const mockItems = [
    {
      id: 1,
      icon: "user",
      title: "Profile Updated",
      time: "10 minutes ago",
      detail: "Your profile information was updated.",
    },
    {
      id: 2,
      icon: "car",
      title: "Ride Requested",
      time: "30 minutes ago",
      detail: "Ride ID: RIDE-123\nPickup location: Main Gate",
    },
    {
      id: 3,
      icon: "users",
      title: "Joined Queue",
      time: "1 hour ago",
      detail: "You joined the passenger queue.",
    },
    {
      id: 4,
      icon: "clock",
      title: "Pickup Time Updated",
      time: "2 hours ago",
      detail: "Your pickup time has been changed.",
    },
  ];

  /**
   * Test panel title rendering.
   */
  it("renders the Recent Activity heading", () => {
    render(<RecentActivity items={mockItems} />);

    expect(
      screen.getByRole("heading", { name: "Recent Activity" })
    ).toBeInTheDocument();
  });

  /**
   * Test rendering of all activity titles.
   */
  it("renders all activity titles", () => {
    render(<RecentActivity items={mockItems} />);

    expect(
      screen.getByText("Profile Updated")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ride Requested")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Joined Queue")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pickup Time Updated")
    ).toBeInTheDocument();
  });

  /**
   * Test rendering of all activity times.
   */
  it("renders all activity times", () => {
    render(<RecentActivity items={mockItems} />);

    expect(screen.getByText("10 minutes ago")).toBeInTheDocument();
    expect(screen.getByText("30 minutes ago")).toBeInTheDocument();
    expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  /**
   * Test that detail text with new lines is split correctly.
   */
  it("splits multiline details into separate lines", () => {
    render(<RecentActivity items={mockItems} />);

    expect(
      screen.getByText("Ride ID: RIDE-123")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pickup location: Main Gate")
    ).toBeInTheDocument();
  });

  /**
   * Test correct icons for activity types.
   */
  it("renders the correct icons", () => {
    render(<RecentActivity items={mockItems} />);

    expect(screen.getByText("👤")).toBeInTheDocument();
    expect(screen.getByText("🚗")).toBeInTheDocument();
    expect(screen.getByText("👥")).toBeInTheDocument();
    expect(screen.getByText("🕐")).toBeInTheDocument();
  });

  /**
   * Test fallback icon for an unknown activity type.
   */
  it("renders the default user icon for an unknown icon type", () => {
    const unknownIconItems = [
      {
        id: 5,
        icon: "unknown",
        title: "Unknown Activity",
        time: "Just now",
        detail: "This activity has an unknown icon type.",
      },
    ];

    render(<RecentActivity items={unknownIconItems} />);

    expect(
      screen.getByText("Unknown Activity")
    ).toBeInTheDocument();

    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  /**
   * Test empty activity list.
   */
  it("renders no activity items when the items array is empty", () => {
    const { container } = render(<RecentActivity items={[]} />);

    expect(
      screen.getByRole("heading", { name: "Recent Activity" })
    ).toBeInTheDocument();

    expect(
      container.querySelectorAll(".activity-item")
    ).toHaveLength(0);
  });
});