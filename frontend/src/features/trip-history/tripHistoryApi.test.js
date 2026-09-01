import { beforeEach, describe, expect, it, vi } from "vitest";

import api from "../../shared/api";
import { getTripHistory } from "./tripHistoryApi";

vi.mock("../../shared/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("getTripHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    api.get.mockResolvedValue({
      data: {
        data: [],
      },
    });
  });

  it("calls API without filters", async () => {
    await getTripHistory();

    expect(api.get).toHaveBeenCalledWith("/trip-history");
  });

  it("sends date filter", async () => {
    await getTripHistory({
      date: "2026-08-30",
    });

    expect(api.get).toHaveBeenCalledWith(
      "/trip-history?date=2026-08-30"
    );
  });

  it("sends destination filter", async () => {
    await getTripHistory({
      destination: "Central Library",
    });

    expect(api.get).toHaveBeenCalledWith(
      "/trip-history?destination=Central+Library"
    );
  });

  it("sends both date and destination filters", async () => {
    await getTripHistory({
      date: "2026-08-30",
      destination: "Central Library",
    });

    expect(api.get).toHaveBeenCalledWith(
      "/trip-history?date=2026-08-30&destination=Central+Library"
    );
  });
});