const {
  beforeEach,
  describe,
  it,
  expect,
  vi,
} = globalThis;

const express = require("express");
const request = require("supertest");

const notificationRoutes = require("./notificationRoutes");
const notificationController = require("./notificationController");
const authMiddleware = require("../../shared/middleware/authMiddleware");

/**
 * Creates an Express application for route testing.
 *
 * @returns {Object} Express test application.
 */
function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/notifications", notificationRoutes);

  return app;
}

describe("Notification Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject GET /api/notifications without authentication", async () => {
    const app = createTestApp();

    const response = await request(app)
      .get("/api/notifications");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required.",
    });
  });

  it("should reject PATCH /api/notifications/read-all without authentication", async () => {
    const app = createTestApp();

    const response = await request(app)
      .patch("/api/notifications/read-all");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required.",
    });
  });

  it("should reject POST /api/notifications without authentication", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/api/notifications")
      .send({
        userId: 2,
        title: "Test",
        message: "Test notification",
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required.",
    });
  });

  it("should reject DELETE /api/notifications without authentication", async () => {
    const app = createTestApp();

    const response = await request(app)
      .delete("/api/notifications");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required.",
    });
  });

  it("should reject PATCH /api/notifications/:notificationId/read without authentication", async () => {
    const app = createTestApp();

    const response = await request(app)
      .patch("/api/notifications/1/read");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required.",
    });
  });
});