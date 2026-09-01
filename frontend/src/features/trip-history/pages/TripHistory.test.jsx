import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TripHistory from "./TripHistory";
import { getTripHistory } from "../tripHistoryApi";

vi.mock("../tripHistoryApi", () => ({
  getTripHistory: vi.fn(),
}));

const mockHistory = [
  {
    id: 1,
    date: "2026-08-30",
    destination: "Central Library",
  },
  {
    id: 2,
    date: "2026-08-29",
    destination: "Sociology Building",
  },
];

describe("TripHistory filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getTripHistory.mockResolvedValue(mockHistory);
  });

  it("sends selected date when date filter is applied", async () => {
    render(<TripHistory />);

    const dateInput = await screen.findByLabelText(/date/i);

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

  it("sends selected destination when destination filter is applied", async () => {
    render(<TripHistory />);

    const destinationInput = await screen.findByLabelText(/destination/i);

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

    const dateInput = await screen.findByLabelText(/date/i);
    const destinationInput = await screen.findByLabelText(/destination/i);

    fireEvent.change(dateInput, {
      target: { value: "2026-08-30" },
    });

    fireEvent.change(destinationInput, {
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

  it("clearing filters shows all trip history", async () => {
    render(<TripHistory />);

    const dateInput = await screen.findByLabelText(/date/i);
    const destinationInput = await screen.findByLabelText(/destination/i);

    fireEvent.change(dateInput, {
      target: { value: "2026-08-30" },
    });

    fireEvent.change(destinationInput, {
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
      screen.getByRole("button", { name: /clear filters/i })
    );

    await waitFor(() => {
      expect(getTripHistory).toHaveBeenLastCalledWith({});
    });
  });
});