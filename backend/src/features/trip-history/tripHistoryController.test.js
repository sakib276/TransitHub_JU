import { beforeEach, describe, expect, it, vi } from "vitest";

import { getTripHistory } from "./tripHistoryController";
import * as tripHistoryModel from "./tripHistoryModel";

vi.mock("./tripHistoryModel");

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

    tripHistoryModel.getTripHistory.mockResolvedValue([
      {
        historyId: 1,
        passengerId: 1,
        farePaid: 40,
        completedAt: "2026-08-30T15:30:00",
      },
    ]);

    await getTripHistory(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalled();
  });

  it("returns an empty list when no history exists", async () => {
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

    tripHistoryModel.getTripHistory.mockResolvedValue([]);

    await getTripHistory(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });
});