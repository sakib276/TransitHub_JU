import { describe, expect, it } from "vitest";

import {
  getNotifications,
  getRecentActivity,
  markAllAsRead,
  markAsRead,
  clearNotifications,
} from "./notificationApi";

describe("notificationApi", () => {
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
    });
  });

  describe("markAsRead", () => {
    it("should resolve successfully for a notification id", async () => {
      await expect(markAsRead("n1")).resolves.toBeUndefined();
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
    });
  });
});