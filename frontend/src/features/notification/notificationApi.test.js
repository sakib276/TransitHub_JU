
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getNotifications,
  getRecentActivity,
  markAllAsRead,
  markAsRead,
  clearNotifications,
} from "./notificationApi";

import { apiRequest } from "../../shared/api";

vi.mock("../../shared/api", () => ({
  apiRequest: vi.fn(),
}));

const mockNotifications = [
  {
    notificationId: "n1",
    userId: 1,
    title: "Driver Assigned",
    message: "A driver has been assigned to your ride.",
    isRead: false,
    createdAt: "2026-10-07T10:30:00.000Z",
  },
  {
    notificationId: "n2",
    userId: 1,
    title: "Queue Updated",
    message: "Your queue position has been updated.",
    isRead: true,
    createdAt: "2026-10-07T10:35:00.000Z",
  },
  {
    notificationId: "n3",
    userId: 1,
    title: "System Maintenance",
    message: "System maintenance is scheduled.",
    isRead: false,
    createdAt: "2026-10-07T11:00:00.000Z",
  },
];

describe("notificationApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    apiRequest.mockResolvedValue({
      success: true,
      data: mockNotifications,
    });
  });

  describe("getNotifications", () => {
    it("should return notifications", async () => {
      const notifications = await getNotifications();

      expect(notifications).toBeInstanceOf(Array);
      expect(notifications.length).toBeGreaterThan(0);
    });

    it("should return notifications with required properties", async () => {
      const notifications = await getNotifications();

      expect(notifications[0]).toHaveProperty("id");
      expect(notifications[0]).toHaveProperty("type");
      expect(notifications[0]).toHaveProperty("category");
      expect(notifications[0]).toHaveProperty("title");
      expect(notifications[0]).toHaveProperty("message");
      expect(notifications[0]).toHaveProperty("time");
      expect(notifications[0]).toHaveProperty("status");
      expect(notifications[0]).toHaveProperty("details");
    });

    it("should return valid notification categories", async () => {
      const notifications = await getNotifications();

      notifications.forEach((notification) => {
        expect(["ride", "queue", "system"]).toContain(
          notification.category
        );
      });
    });

    it("should return valid notification statuses", async () => {
      const notifications = await getNotifications();

      notifications.forEach((notification) => {
        expect(["read", "unread"]).toContain(
          notification.status
        );
      });
    });
  });

  describe("getRecentActivity", () => {
    it("should return recent activity", async () => {
      const activity = await getRecentActivity();

      expect(activity).toBeInstanceOf(Array);
      expect(activity.length).toBeGreaterThan(0);
    });

    it("should return activity with required properties", async () => {
      const activity = await getRecentActivity();

      expect(activity[0]).toHaveProperty("id");
      expect(activity[0]).toHaveProperty("icon");
      expect(activity[0]).toHaveProperty("title");
      expect(activity[0]).toHaveProperty("detail");
      expect(activity[0]).toHaveProperty("time");
    });
  });

  describe("markAllAsRead", () => {
    it("should resolve successfully", async () => {
      await expect(markAllAsRead()).resolves.toBeUndefined();

      expect(apiRequest).toHaveBeenCalledWith(
        "/notifications/read-all",
        {
          method: "PATCH",
        }
      );
    });
  });

  describe("markAsRead", () => {
    it("should resolve successfully for a notification id", async () => {
      await expect(markAsRead("n1")).resolves.toBeUndefined();

      expect(apiRequest).toHaveBeenCalledWith(
        "/notifications/n1/read",
        {
          method: "PATCH",
        }
      );
    });

    it("should accept different notification ids", async () => {
      await expect(markAsRead("n2")).resolves.toBeUndefined();
      await expect(markAsRead("n3")).resolves.toBeUndefined();
      await expect(markAsRead("n4")).resolves.toBeUndefined();
    });
  });

  describe("clearNotifications", () => {
    it("should resolve successfully", async () => {
      await expect(clearNotifications()).resolves.toBeUndefined();

      expect(apiRequest).toHaveBeenCalledWith(
        "/notifications",
        {
          method: "DELETE",
        }
      );
    });
  });
});

