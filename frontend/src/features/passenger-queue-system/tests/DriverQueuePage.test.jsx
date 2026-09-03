import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DriverQueuePage from "../pages/DriverQueuePage";
import { assignPassenger, getQueue, markNoShow } from "../services/queueService";

vi.mock("../services/queueService", () => ({
  assignPassenger: vi.fn(),
  getQueue: vi.fn(),
  markNoShow: vi.fn(),
}));

describe("DriverQueuePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getQueue.mockResolvedValue([
      { id: 1, passenger_id: 1, token: "JU-001", priority: true, destination_name: "Central Library", seats_needed: 1, gender_preference: "Female" },
      { id: 2, passenger_id: 2, token: "JU-002", priority: false, destination_name: "Business Studies", seats_needed: 2, gender_preference: "Any" },
      { id: 3, passenger_id: 3, token: "JU-003", priority: false, destination_name: "Transport", seats_needed: 1, gender_preference: "Male" },
    ]);
    assignPassenger.mockResolvedValue({ seatsUsed: 1, message: "Passenger assigned successfully." });
    markNoShow.mockResolvedValue({ message: "Passenger marked as no-show." });
    render(<DriverQueuePage />);
  });

  it("renders all waiting passengers", async () => {
    await waitFor(() => expect(screen.getByText("Passenger 1")).toBeInTheDocument());
    expect(screen.getByText("Passenger 2")).toBeInTheDocument();
    expect(screen.getByText("Passenger 3")).toBeInTheDocument();
  });

  it("assigns a seat through the API", async () => {
    await waitFor(() => expect(screen.getAllByRole("button", { name: /assign passenger/i })).toHaveLength(3));
    fireEvent.click(screen.getAllByRole("button", { name: /assign passenger/i })[0]);

    await waitFor(() => expect(assignPassenger).toHaveBeenCalledWith(1, {
      driver_id: 2,
      vehicle_id: 1,
      availableSeats: 2,
    }));
  });

  it("disables assignment when seats are insufficient", async () => {
    await waitFor(() => expect(screen.getByText("Passenger 2")).toBeInTheDocument());
    expect(screen.getAllByRole("button", { name: /assign passenger/i })[1]).toBeDisabled();
    expect(assignPassenger).not.toHaveBeenCalled();
  });

  it("marks a passenger as no-show through the API", async () => {
    await waitFor(() => expect(screen.getAllByRole("button", { name: /no-show/i })).toHaveLength(3));
    fireEvent.click(screen.getAllByRole("button", { name: /no-show/i })[2]);

    await waitFor(() => expect(markNoShow).toHaveBeenCalledWith(3));
  });

});