const jwt = require("jsonwebtoken");

const {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} = globalThis;

const authMiddleware = require("./authMiddleware");

describe("Auth Middleware", () => {
  const JWT_SECRET = "test-secret";

  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    vi.clearAllMocks();
  });

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

  it("should return 401 when authorization header is missing", () => {
    const req = {
      headers: {},
    };

    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication required.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header does not use Bearer format", () => {
    const req = {
      headers: {
        authorization: "Basic abc123",
      },
    };

    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication required.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when the JWT is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when the JWT is expired", () => {
    const expiredToken = jwt.sign(
      {
        userId: 2,
        role: "Passenger",
      },
      JWT_SECRET,
      {
        expiresIn: "-1s",
      }
    );

    const req = {
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    };

    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should authenticate a valid JWT", () => {
    const token = jwt.sign(
      {
        userId: 2,
        role: "Passenger",
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    expect(req.user).toEqual({
      userId: 2,
      role: "Passenger",
    });

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should authenticate an Admin user", () => {
    const token = jwt.sign(
      {
        userId: 1,
        role: "Admin",
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    expect(req.user).toEqual({
      userId: 1,
      role: "Admin",
    });
  });
});