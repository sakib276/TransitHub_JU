import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminQueuePage from "../pages/AdminQueuePage";
import { approvePriorityRequest, assignPassenger, getPendingPriorityRequests, getQueue } from "../services/queueService";

vi.mock("../services/queueService", () => ({
  approvePriorityRequest: vi.fn(),
  assignPassenger: vi.fn(),
  getPendingPriorityRequests: vi.fn(),
  getQueue: vi.fn(),
  locations: [
    { id: 1, name: "JU Gate" },
    { id: 2, name: "Central Library" },
    { id: 3, name: "Business Studies" },
    { id: 4, name: "Transport" },
  ],
  rejectPriorityRequest: vi.fn(),
}));

vi.mock("../components/AdminQueueTable", () => ({
  default: ({ passengers, onAssign }) => (
    <div>{passengers.map((passenger) => (
      <div key={passenger.id}>
        <span>{passenger.name}</span>
        <button onClick={() => onAssign(passenger.id)}>Assign {passenger.name}</button>
      </div>
    ))}</div>
  ),
}));

describe("AdminQueuePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getQueue.mockResolvedValue([
      { id: 1, token: "JU-001", passenger_id: 1, pickup_location_id: 1, destination_location_id: 2, seats_needed: 1, gender_preference: "Female", priority: true },
      { id: 2, token: "JU-002", passenger_id: 2, pickup_location_id: 1, destination_location_id: 3, seats_needed: 2, gender_preference: "Any", priority: false },
    ]);
    getPendingPriorityRequests.mockResolvedValue([
      { id: 9, queue_entry_id: 1, passenger_id: 1, reason: "Medical emergency", proof_path: "/uploads/proof.pdf" },
    ]);
    assignPassenger.mockResolvedValue({ seatsUsed: 1, message: "Passenger assigned successfully." });
    approvePriorityRequest.mockResolvedValue({ status: "Approved" });
    render(<AdminQueuePage />);
  });

  it("loads passengers for the selected pickup point", async () => {
    await waitFor(() => expect(screen.getByText("Passenger 1")).toBeInTheDocument());
    expect(screen.getByText("Passenger 2")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/pickup point/i), { target: { value: "2" } });
    await waitFor(() => expect(getQueue).toHaveBeenCalledWith("2"));
  });

  it("assigns a passenger through the API", async () => {
    await waitFor(() => screen.getByText(/assign passenger 1/i));
    fireEvent.click(screen.getByText(/assign passenger 1/i));
    await waitFor(() => expect(assignPassenger).toHaveBeenCalledWith(1, { driver_id: 2, vehicle_id: 1, availableSeats: 2 }));
  });

  it("prevents assignment when seats are insufficient", async () => {
    fireEvent.change(screen.getByLabelText(/incoming vehicle seats/i), { target: { value: "1" } });
    await waitFor(() => screen.getByText(/assign passenger 2/i));
    fireEvent.click(screen.getByText(/assign passenger 2/i));
    expect(screen.getByText(/not enough available seats/i)).toBeInTheDocument();
    expect(assignPassenger).not.toHaveBeenCalled();
  });

  it("shows and approves a pending priority request", async () => {
    await waitFor(() => expect(screen.getByText("Medical emergency")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /view proof/i })).toHaveAttribute("href", "http://localhost:5000/uploads/proof.pdf");
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await waitFor(() => expect(approvePriorityRequest).toHaveBeenCalledWith(9));
  });

  it("shows a message when no passenger fits", async () => {
    fireEvent.change(screen.getByLabelText(/incoming vehicle seats/i), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: /assign seats automatically/i }));
    await waitFor(() => expect(screen.getByText(/no waiting passenger's seat request fits/i)).toBeInTheDocument());
  });
});