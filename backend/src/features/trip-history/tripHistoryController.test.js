import { describe, expect, it, beforeEach, vi } from "vitest";

import { getTripHistory } from "./tripHistoryController";

describe("tripHistoryController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns passenger trip history successfully", async () => {
    const request = {
      user: {
        userId: 1,
      },
      query: {},
    };

    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getTripHistory(request, response);

    expect(response.status).toHaveBeenCalledWith(200);

    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: [
        {
          id: 1,
          passengerId: 1,
          tripId: 101,
          routeName: "JU Campus Route",
          destination: "Central Library",
          completedAt: "2026-08-30T10:30:00",
        },
        {
          id: 2,
          passengerId: 1,
          tripId: 102,
          routeName: "Rokeya Hall",
          destination: "Bottola",
          completedAt: "2026-08-29T15:00:00",
        },
      ],
    });
  });

  it("returns an empty list when no history exists", async () => {
    const request = {
      user: {
        userId: 999,
      },
      query: {},
    };

    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getTripHistory(request, response);

    expect(response.status).toHaveBeenCalledWith(200);

    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });
});