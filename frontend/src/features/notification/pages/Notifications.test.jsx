import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

import Notifications from "./Notifications";

import {
  getNotifications,
  getRecentActivity,
  markAllAsRead,
  clearNotifications,
} from "../notificationApi";


// Mock API functions
vi.mock("../notificationApi", () => ({
  getNotifications: vi.fn(),
  getRecentActivity: vi.fn(),
  markAllAsRead: vi.fn(),
  clearNotifications: vi.fn(),
}));


// Mock child components to focus testing on Notifications page
vi.mock("../components/NotificationCard", () => ({
  default: ({ notification, isSelected, onSelect }) => (
    <button
      onClick={() => onSelect(notification)}
      data-testid={`notification-${notification.id}`}
      data-selected={isSelected}
    >
      {notification.title}
    </button>
  ),
}));

vi.mock("../components/NotificationDetails", () => ({
  default: ({ notification }) => (
    <div data-testid="notification-details">
      {notification
        ? `Selected: ${notification.title}`
        : "No notification selected"}
    </div>
  ),
}));

vi.mock("../components/RecentActivity", () => ({
  default: ({ items }) => (
    <div data-testid="recent-activity">
      Activity count: {items.length}
    </div>
  ),
}));


describe("Notifications", () => {
  const mockNotifications = [
    {
      id: 1,
      title: "Driver Assigned",
      status: "unread",
      category: "ride",
      type: "driver_assigned",
      details: {},
    },
    {
      id: 2,
      title: "Queue Updated",
      status: "read",
      category: "queue",
      type: "queue_update",
      details: {},
    },
    {
      id: 3,
      title: "System Maintenance",
      status: "unread",
      category: "system",
      type: "system_maintenance",
      details: {},
    },
  ];

  const mockActivity = [
    {
      id: 1,
      icon: "user",
      title: "Profile Updated",
      time: "10 minutes ago",
      detail: "Your profile was updated.",
    },
    {
      id: 2,
      icon: "car",
      title: "Ride Requested",
      time: "30 minutes ago",
      detail: "Ride request created.",
    },
  ];


  beforeEach(() => {
    vi.clearAllMocks();

    getNotifications.mockResolvedValue(mockNotifications);
    getRecentActivity.mockResolvedValue(mockActivity);
    markAllAsRead.mockResolvedValue({});
    clearNotifications.mockResolvedValue({});
  });


  /**
   * Test loading state.
   */
  it("shows loading message while data is loading", () => {
    getNotifications.mockReturnValue(new Promise(() => {}));
    getRecentActivity.mockReturnValue(new Promise(() => {}));

    render(<Notifications />);

    expect(
      screen.getByText("Loading notifications…")
    ).toBeInTheDocument();
  });


  /**
   * Test notifications after data loads.
   */
  it("loads and displays notifications", async () => {
    render(<Notifications />);

    await waitFor(() => {
      expect(
        screen.getByText("Driver Assigned")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Queue Updated")
    ).toBeInTheDocument();

    expect(
      screen.getByText("System Maintenance")
    ).toBeInTheDocument();

    expect(getNotifications).toHaveBeenCalledTimes(1);
    expect(getRecentActivity).toHaveBeenCalledTimes(1);
  });


  /**
   * Test first notification is selected automatically.
   */
  it("selects the first notification after loading", async () => {
    render(<Notifications />);

    await waitFor(() => {
      expect(
        screen.getByTestId("notification-details")
      ).toHaveTextContent("Selected: Driver Assigned");
    });
  });


  /**
   * Test unread filter.
   */
  it("filters notifications by unread status", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("Driver Assigned");

    await user.click(
      screen.getByRole("button", { name: "Unread" })
    );

    expect(
      screen.getByText("Driver Assigned")
    ).toBeInTheDocument();

    expect(
      screen.getByText("System Maintenance")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Queue Updated")
    ).not.toBeInTheDocument();
  });


  /**
   * Test ride category filter.
   */
  it("filters notifications by ride category", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("Driver Assigned");

    await user.click(
      screen.getByRole("button", { name: "Ride Updates" })
    );

    expect(
      screen.getByText("Driver Assigned")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Queue Updated")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("System Maintenance")
    ).not.toBeInTheDocument();
  });


  /**
   * Test queue category filter.
   */
  it("filters notifications by queue category", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("Queue Updated");

    await user.click(
      screen.getByRole("button", { name: "Queue Updates" })
    );

    expect(
      screen.getByText("Queue Updated")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Driver Assigned")
    ).not.toBeInTheDocument();
  });


  /**
   * Test system category filter.
   */
  it("filters notifications by system category", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("System Maintenance");

    await user.click(
      screen.getByRole("button", {
        name: "System Announcements",
      })
    );

    expect(
      screen.getByText("System Maintenance")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Driver Assigned")
    ).not.toBeInTheDocument();
  });


  /**
   * Test notification selection.
   */
  it("selects a notification when clicked", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("Queue Updated");

    await user.click(
      screen.getByTestId("notification-2")
    );

    expect(
      screen.getByTestId("notification-details")
    ).toHaveTextContent("Selected: Queue Updated");
  });


  /**
   * Test clicking an unread notification marks it as selected.
   */
  it("updates the selected notification when an unread notification is clicked", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("System Maintenance");

    await user.click(
      screen.getByTestId("notification-3")
    );

    expect(
      screen.getByTestId("notification-details")
    ).toHaveTextContent(
      "Selected: System Maintenance"
    );
  });


  /**
   * Test Mark All as Read button.
   */
  it("calls markAllAsRead when Mark All as Read is clicked", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("Driver Assigned");

    await user.click(
      screen.getByRole("button", {
        name: /Mark All as Read/i,
      })
    );

    await waitFor(() => {
      expect(markAllAsRead).toHaveBeenCalledTimes(1);
    });
  });


  /**
   * Test Clear Notifications button.
   */
  it("clears all notifications when Clear Notifications is clicked", async () => {
    const user = userEvent.setup();

    render(<Notifications />);

    await screen.findByText("Driver Assigned");

    await user.click(
      screen.getByRole("button", {
        name: /Clear Notifications/i,
      })
    );

    await waitFor(() => {
      expect(clearNotifications).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText("No notifications here.")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("notification-details")
    ).toHaveTextContent("No notification selected");
  });


  /**
   * Test empty notification list.
   */
  it("shows empty message when no notifications are returned", async () => {
    getNotifications.mockResolvedValue([]);

    render(<Notifications />);

    expect(
      await screen.findByText("No notifications here.")
    ).toBeInTheDocument();
  });


  /**
   * Test recent activity data.
   */
  it("passes recent activity to the RecentActivity component", async () => {
    render(<Notifications />);

    await waitFor(() => {
      expect(
        screen.getByTestId("recent-activity")
      ).toHaveTextContent("Activity count: 2");
    });
  });
});