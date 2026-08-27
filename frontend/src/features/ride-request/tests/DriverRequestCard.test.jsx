import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DriverRequestCard from "../components/DriverRequestCard";

const mockRequest = {
  id: 1,
  passenger: "Anika",
  pickup: "JU Gate",
  destination: "Medical",
  seats: 2,
  time: "10:30 AM",
};

describe("DriverRequestCard", () => {
  it("renders passenger and ride information", () => {
    render(
      <DriverRequestCard
        request={mockRequest}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );

    expect(screen.getByText("Anika")).toBeInTheDocument();
    expect(screen.getByText("JU Gate")).toBeInTheDocument();
    expect(screen.getByText("Medical")).toBeInTheDocument();
    expect(screen.getByText("10:30 AM")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("calls onAccept when Accept is clicked", () => {
    const onAccept = vi.fn();

    render(
      <DriverRequestCard
        request={mockRequest}
        onAccept={onAccept}
        onReject={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /accept/i }));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onReject when Reject is clicked", () => {
    const onReject = vi.fn();

    render(
      <DriverRequestCard
        request={mockRequest}
        onAccept={vi.fn()}
        onReject={onReject}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /reject/i }));

    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it("shows the passenger initial inside the avatar", () => {
    render(
      <DriverRequestCard
        request={mockRequest}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );

    expect(screen.getByText("A")).toBeInTheDocument();
  });
});