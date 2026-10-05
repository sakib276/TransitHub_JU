import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DriverRequestCard from "../components/driver-request-card";

const mockRequest = {
  id: 1,
  passenger: "Anika",
  pickup: "JU Gate",
  destination: "Medical",
  seats: 2,
  joinedAt: "2026-10-05T04:30:00.000Z",
};

describe("DriverRequestCard", () => {
  it("renders passenger and ride information", () => {
    render(
      React.createElement(DriverRequestCard, {
        request: mockRequest,
        onAccept: vi.fn(),
        onReject: vi.fn(),
      })
    );

    expect(screen.getByText("Anika")).toBeInTheDocument();
    expect(screen.getByText("JU Gate")).toBeInTheDocument();
    expect(screen.getByText("Medical")).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockRequest.joinedAt).toLocaleTimeString())
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Waiting")).toBeInTheDocument();
  });

  it("calls onAccept when Accept is clicked", () => {
    const onAccept = vi.fn();

    render(
      React.createElement(DriverRequestCard, {
        request: mockRequest,
        onAccept,
        onReject: vi.fn(),
      })
    );

    fireEvent.click(screen.getByRole("button", { name: /accept/i }));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onReject when Reject is clicked", () => {
    const onReject = vi.fn();

    render(
      React.createElement(DriverRequestCard, {
        request: mockRequest,
        onAccept: vi.fn(),
        onReject,
      })
    );

    fireEvent.click(screen.getByRole("button", { name: /reject/i }));

    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it("shows the passenger initial inside the avatar", () => {
    render(
      React.createElement(DriverRequestCard, {
        request: mockRequest,
        onAccept: vi.fn(),
        onReject: vi.fn(),
      })
    );

    expect(screen.getByText("A")).toBeInTheDocument();
  });
});