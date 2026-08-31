import { describe, expect, it } from "vitest";

import { getTripHistory } from "./tripHistoryModel";

describe("tripHistoryModel", () => {
  it("returns trip history for the requested passenger", async () => {
    const passengerId = 1;

    const result = await getTripHistory(passengerId);

    expect(result).toBeInstanceOf(Array);
  });

  it("does not return another passenger's records", async () => {
    const passengerId = 1;

    const result = await getTripHistory(passengerId);

    result.forEach((trip) => {
      expect(trip.passengerId).toBe(passengerId);
    });
  });

  it("returns an empty array when the passenger has no history", async () => {
    const passengerId = 99999;

    const result = await getTripHistory(passengerId);

    expect(result).toEqual([]);
  });
});

it("filters history by completion date", async () => {
  const passengerId = 1;

  const result = await getTripHistory(passengerId, {
    date: "2026-08-30",
  });

  result.forEach((trip) => {
    expect(trip.completedAt.startsWith("2026-08-30")).toBe(true);
  });
});

it("filters history by destination", async () => {
  const passengerId = 1;

  const result = await getTripHistory(passengerId, {
    destination: "Central Library",
  });

  result.forEach((trip) => {
    expect(trip.destination).toBe("Central Library");
  });
});