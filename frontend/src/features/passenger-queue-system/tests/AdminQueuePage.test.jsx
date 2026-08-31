import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminQueuePage from "../pages/AdminQueuePage";

// Mock the child component
vi.mock("../components/AdminQueueTable", () => ({
  default: ({ passengers, onAssign }) => (
    <div>
      {passengers.map((p) => (
        <div key={p.id}>
          <span>{p.name}</span>
          <button onClick={() => onAssign(p.id)}>Assign {p.name}</button>
        </div>
      ))}
    </div>
  ),
}));

describe("AdminQueuePage", () => {
  beforeEach(() => {
    render(<AdminQueuePage />);
  });

  it("shows only passengers from the selected pickup point", () => {
    expect(screen.getByText("Anika")).toBeInTheDocument();
    expect(screen.getByText("Nafis")).toBeInTheDocument();
    expect(screen.queryByText("Raiyan")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/pickup point/i), {
      target: { value: "Medical" },
    });

    expect(screen.getByText("Raiyan")).toBeInTheDocument();
    expect(screen.queryByText("Anika")).not.toBeInTheDocument();
  });

  it("manually assigns a passenger and updates the seat count", () => {
    fireEvent.click(screen.getByText(/assign anika/i));

    expect(
      screen.getByText(/1 seat assigned and queue positions refreshed/i)
    ).toBeInTheDocument();

    expect(screen.queryByText("Anika")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("prevents assignment when available seats are insufficient", () => {
    fireEvent.change(screen.getByLabelText(/incoming vehicle seats/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText(/assign nafis/i));

    expect(
      screen.getByText(/not enough available seats/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Nafis")).toBeInTheDocument();
  });

  it("automatically assigns passengers by queue order", () => {
    fireEvent.change(screen.getByLabelText(/incoming vehicle seats/i), {
      target: { value: "3" },
    });

    fireEvent.click(screen.getByText(/assign seats automatically/i));

    expect(
      screen.getByText(/3 seats assigned automatically by queue order/i)
    ).toBeInTheDocument();

    expect(screen.queryByText("Anika")).not.toBeInTheDocument();
    expect(screen.queryByText("Nafis")).not.toBeInTheDocument();
  });

  it("shows a message when no passenger fits the available seats", () => {
    fireEvent.change(screen.getByLabelText(/incoming vehicle seats/i), {
      target: { value: "0" },
    });

    fireEvent.click(screen.getByText(/assign seats automatically/i));

    expect(
      screen.getByText(/no waiting passenger's seat request fits/i)
    ).toBeInTheDocument();
  });
});