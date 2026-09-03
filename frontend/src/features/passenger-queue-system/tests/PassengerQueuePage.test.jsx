import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PassengerQueuePage from "../pages/PassengerQueuePage";
import usePassengerQueue from "../hooks/usePassengerQueue";

vi.mock("../hooks/usePassengerQueue");

describe("PassengerQueuePage", () => {
  const joinQueue = vi.fn();
  const submitPriorityRequest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    usePassengerQueue.mockReturnValue({
      queueEntry: null,
      priorityStatus: "",
      message: "",
      joinQueue,
      submitPriorityRequest,
    });
  });

  it("renders the empty queue status initially", () => {
    render(<PassengerQueuePage />);

    expect(
      screen.getByText(/choose a pickup point to see your queue status here/i)
    ).toBeInTheDocument();
  });

  it("submits queue data when Join Queue is clicked", () => {
    render(<PassengerQueuePage />);

    fireEvent.change(screen.getByLabelText(/pickup point/i), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText(/destination point/i), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByLabelText(/seats needed/i), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByLabelText(/gender preference/i), {
      target: { value: "Female" },
    });

    fireEvent.click(screen.getByLabelText(/request priority consideration/i));
    fireEvent.click(screen.getByRole("button", { name: /join queue/i }));

    expect(joinQueue).toHaveBeenCalledWith({
      passenger_id: 1,
      pickup_location_id: 1,
      destination_location_id: 2,
      seats_needed: 2,
      gender_preference: "Female",
      priority: true,
    });
  });

  it("displays queue information when a passenger has joined", () => {
    usePassengerQueue.mockReturnValue({
      queueEntry: {
        token: "JU-101",
        position: 3,
        pickup_location_id: 1,
        destination_location_id: 2,
        seats_needed: 1,
        gender_preference: "Any",
        priority: false,
        joined_at: "2026-09-04T10:30:00.000Z",
      },
      priorityStatus: "Waiting",
      message: "",
      joinQueue,
      submitPriorityRequest,
    });

    render(<PassengerQueuePage />);

    expect(screen.getByText("JU-101")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/2026|2025/)).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
  });

  it("shows system messages from the hook", () => {
    usePassengerQueue.mockReturnValue({
      queueEntry: null,
      priorityStatus: "",
      message: "Successfully joined the queue.",
      joinQueue,
      submitPriorityRequest,
    });

    render(<PassengerQueuePage />);

    expect(
      screen.getByText(/successfully joined the queue/i)
    ).toBeInTheDocument();
  });

  it("submits a priority request", async () => {
    usePassengerQueue.mockReturnValue({
      queueEntry: { id: 7, token: "JU-101", position: 3, pickup_location_id: 1, destination_location_id: 2, seats_needed: 1, gender_preference: "Any", priority: false, joined_at: "2026-09-04T10:30:00.000Z" },
      priorityStatus: null,
      message: "",
      joinQueue,
      submitPriorityRequest,
    });

    render(<PassengerQueuePage />);

    fireEvent.change(screen.getByLabelText(/emergency reason/i), {
      target: { value: "Medical emergency" },
    });

    const file = new File(["proof"], "proof.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByLabelText(/supporting proof/i), {
      target: { files: [file] },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit priority request/i })
    );

    await waitFor(() => expect(submitPriorityRequest).toHaveBeenCalledWith({
      reason: "Medical emergency",
      proof: file,
    }));
  });

  it("disables the join form when already in queue", () => {
    usePassengerQueue.mockReturnValue({
      queueEntry: {
        token: "JU-001",
        position: 1,
        pickup: "JU Gate",
        destination: "Library",
        seats: 1,
        gender: "Any",
        priority: true,
        joinedAt: "9:00 AM",
      },
      priorityStatus: "Pending",
      message: "",
      joinQueue,
      submitPriorityRequest,
    });

    render(<PassengerQueuePage />);

    expect(
      screen.getByRole("button", { name: /already in queue/i })
    ).toBeDisabled();
  });
});