const {
  beforeEach,
  describe,
  it,
  expect,
  vi,
} = globalThis;

const notificationModel = require("./notificationModel");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createUserNotification,
  clearNotifications,
} = require("./notificationController");

/**
 * Creates a mock Express response object.
 *
 * @returns {Object} Mock response object.
 */
function createMockResponse() {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
}

describe("Notification Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getNotifications", () => {
    it("should return notifications for the authenticated user", async () => {
      const mockNotifications = [
        {
          notificationId: 1,
          userId: 2,
          title: "Ride Accepted",
          message: "Your ride has been accepted.",
          isRead: false,
        },
      ];

      notificationModel.getNotificationsByUserId = vi
        .fn()
        .mockResolvedValue(mockNotifications);

      const req = {
        user: {
          userId: 2,
        },
      };

      const res = createMockResponse();

      await getNotifications(req, res);

      expect(
        notificationModel.getNotificationsByUserId
      ).toHaveBeenCalledWith(2);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications,
      });
    });

    it("should return 500 when retrieving notifications fails", async () => {
      notificationModel.getNotificationsByUserId = vi
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {
        user: {
          userId: 2,
        },
      };

      const res = createMockResponse();

      await getNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unable to retrieve notifications. Please try again.",
      });
    });
  });

  describe("markAsRead", () => {
    it("should mark a valid notification as read", async () => {
      notificationModel.getNotificationById = vi
        .fn()
        .mockResolvedValue({
          notificationId: 1,
          userId: 2,
          isRead: false,
        });

      notificationModel.markNotificationAsRead = vi
        .fn()
        .mockResolvedValue(1);

      const req = {
        user: {
          userId: 2,
        },
        params: {
          notificationId: "1",
        },
      };

      const res = createMockResponse();

      await markAsRead(req, res);

      expect(
        notificationModel.getNotificationById
      ).toHaveBeenCalledWith(1, 2);

      expect(
        notificationModel.markNotificationAsRead
      ).toHaveBeenCalledWith(1, 2);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Notification marked as read.",
      });
    });

    it("should return 400 for an invalid notification ID", async () => {
      const req = {
        user: {
          userId: 2,
        },
        params: {
          notificationId: "abc",
        },
      };

      const res = createMockResponse();

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid notification ID.",
      });
    });

    it("should return 404 when notification does not belong to the user", async () => {
      notificationModel.getNotificationById = vi
        .fn()
        .mockResolvedValue(null);

      const req = {
        user: {
          userId: 2,
        },
        params: {
          notificationId: "999",
        },
      };

      const res = createMockResponse();

      await markAsRead(req, res);

      expect(
        notificationModel.getNotificationById
      ).toHaveBeenCalledWith(999, 2);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Notification not found.",
      });
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all user notifications as read", async () => {
      notificationModel.markAllNotificationsAsRead = vi
        .fn()
        .mockResolvedValue(3);

      const req = {
        user: {
          userId: 2,
        },
      };

      const res = createMockResponse();

      await markAllAsRead(req, res);

      expect(
        notificationModel.markAllNotificationsAsRead
      ).toHaveBeenCalledWith(2);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "All notifications marked as read.",
      });
    });

    it("should return 500 when marking all notifications fails", async () => {
      notificationModel.markAllNotificationsAsRead = vi
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {
        user: {
          userId: 2,
        },
      };

      const res = createMockResponse();

      await markAllAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unable to update notifications. Please try again.",
      });
    });
  });

  describe("createUserNotification", () => {
    it("should create a notification with valid data", async () => {
      const createdNotification = {
        notificationId: 10,
        userId: 2,
        title: "Ride Accepted",
        message: "Your ride has been accepted.",
        isRead: false,
      };

      notificationModel.createNotification = vi
        .fn()
        .mockResolvedValue(createdNotification);

      const req = {
        body: {
          userId: 2,
          title: "Ride Accepted",
          message: "Your ride has been accepted.",
        },
      };

      const res = createMockResponse();

      await createUserNotification(req, res);

      expect(
        notificationModel.createNotification
      ).toHaveBeenCalledWith(
        2,
        "Ride Accepted",
        "Your ride has been accepted."
      );

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdNotification,
      });
    });

    it("should return 400 when required data is missing", async () => {
      const req = {
        body: {
          userId: 2,
          title: "Ride Accepted",
        },
      };

      const res = createMockResponse();

      await createUserNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID, title, and message are required.",
      });
    });

    it("should return 400 when title is longer than 100 characters", async () => {
      const longTitle = "A".repeat(101);

      const req = {
        body: {
          userId: 2,
          title: longTitle,
          message: "Test message",
        },
      };

      const res = createMockResponse();

      await createUserNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Title must be 100 characters or fewer.",
      });
    });

    it("should return 404 when the user does not exist", async () => {
      const foreignKeyError = new Error("Foreign key error");
      foreignKeyError.name = "SequelizeForeignKeyConstraintError";

      notificationModel.createNotification = vi
        .fn()
        .mockRejectedValue(foreignKeyError);

      const req = {
        body: {
          userId: 9999,
          title: "Test Notification",
          message: "Test message",
        },
      };

      const res = createMockResponse();

      await createUserNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found.",
      });
    });
  });

  describe("clearNotifications", () => {
    it("should clear notifications for the authenticated user", async () => {
      notificationModel.deleteNotificationsByUserId = vi
        .fn()
        .mockResolvedValue(3);

      const req = {
        user: {
          userId: 2,
        },
      };

      const res = createMockResponse();

      await clearNotifications(req, res);

      expect(
        notificationModel.deleteNotificationsByUserId
      ).toHaveBeenCalledWith(2);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "All notifications cleared.",
      });
    });

    it("should return 500 when clearing notifications fails", async () => {
      notificationModel.deleteNotificationsByUserId = vi
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {
        user: {
          userId: 2,
        },
      };

      const res = createMockResponse();

      await clearNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unable to clear notifications. Please try again.",
      });
    });
  });
});