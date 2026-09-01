import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TripHistory from "./TripHistory";
import { getTripHistory } from "../tripHistoryApi";

vi.mock("../tripHistoryApi", () => ({
  getTripHistory: vi.fn(),
}));

describe("TripHistory filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getTripHistory.mockResolvedValue([
      {
        id: 1,
        date: "2026-08-30",
        destination: "Central Library",
        fare: 20,
      },
      {
        id: 2,
        date: "2026-08-29",
        destination: "Dairy Gate",
        fare: 15,
      },
    ]);
  });

  it("sends the selected date when applying the date filter", async () => {
    render(<TripHistory />);

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenCalledWith({});
    });

    const dateInput = screen.getByLabelText(/date/i);
    fireEvent.change(dateInput, {
      target: { value: "2026-08-30" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply filters/i }));

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenLastCalledWith({
        date: "2026-08-30",
      });
    });
  });

  it("sends the selected destination when applying the destination filter", async () => {
    render(<TripHistory />);

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenCalledWith({});
    });

    const destinationInput = screen.getByLabelText(/destination/i);

    fireEvent.change(destinationInput, {
      target: { value: "Central Library" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply filters/i }));

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenLastCalledWith({
        destination: "Central Library",
      });
    });
  });

  it("sends both date and destination filters together", async () => {
    render(<TripHistory />);

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenCalledWith({});
    });

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2026-08-30" },
    });

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: "Central Library" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply filters/i }));

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenLastCalledWith({
        date: "2026-08-30",
        destination: "Central Library",
      });
    });
  });

  it("clears filters and shows all trip history", async () => {
    render(<TripHistory />);

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenCalledWith({});
    });

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2026-08-30" },
    });

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: "Central Library" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply filters/i }));

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenLastCalledWith({
        date: "2026-08-30",
        destination: "Central Library",
      });
    });

    fireEvent.click(
      screen.getByRole("button", { name: /clear filters/i }),
    );

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenLastCalledWith({});
    });

    expect(screen.getByLabelText(/date/i)).toHaveValue("");
    expect(screen.getByLabelText(/destination/i)).toHaveValue("");
  });
});