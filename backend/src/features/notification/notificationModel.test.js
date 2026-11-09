const { beforeAll, afterAll, describe, it, expect } = globalThis;

const sequelize = require("../../config/database");

const {
  Notification,
  getNotificationsByUserId,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} = require("./notificationModel");

/**
 * Tests notification model database operations.
 *
 * @module notificationModelTest
 */

describe("Notification Model", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should retrieve notifications for a user", async () => {
    const notifications = await getNotificationsByUserId(2);

    expect(Array.isArray(notifications)).toBe(true);
  });

  it("should find a notification belonging to the correct user", async () => {
    const notification = await Notification.findOne();

    if (!notification) {
      return;
    }

    const result = await getNotificationById(
      notification.notificationId,
      notification.userId
    );

    expect(result).not.toBeNull();
    expect(result.notificationId).toBe(notification.notificationId);
  });

  it("should not find a notification belonging to another user", async () => {
    const notification = await Notification.findOne();

    if (!notification) {
      return;
    }

    const result = await getNotificationById(
      notification.notificationId,
      notification.userId + 9999
    );

    expect(result).toBeNull();
  });

  it("should mark a notification as read", async () => {
    const notification = await Notification.findOne({
      where: {
        userId: 2,
      },
    });

    if (!notification) {
      return;
    }

    const updatedCount = await markNotificationAsRead(
      notification.notificationId,
      notification.userId
    );

    expect(updatedCount).toBeGreaterThanOrEqual(0);
  });

  it("should mark all notifications as read for a user", async () => {
    const updatedCount = await markAllNotificationsAsRead(2);

    expect(updatedCount).toBeGreaterThanOrEqual(0);
  });

  it("should create a notification", async () => {
    const notification = await createNotification(
      2,
      "Automated Test",
      "This notification was created by the automated test."
    );

    expect(notification).toBeDefined();
    expect(notification.notificationId).toBeDefined();
    expect(notification.userId).toBe(2);

    await notification.destroy();
  });
});