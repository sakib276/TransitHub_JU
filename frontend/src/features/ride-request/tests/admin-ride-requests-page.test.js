import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const mockGetRideRequests = vi.hoisted(() => vi.fn());

vi.mock("../hooks/use-ride-request", () => ({
  default: () => ({
    error: "",
    getRideRequests: mockGetRideRequests,
  }),
}));

import AdminRideRequestsPage from "../pages/admin-ride-requests-page";

const REQUESTS = [
  {
    id: 101,
    passenger: "Anika",
    pickup: "JU Gate",
    destination: "Medical",
    joinedAt: "2026-08-26T10:00:00.000Z",
    status: "Waiting",
  },
  {
    id: 102,
    passenger: "Nafis",
    pickup: "Transport",
    destination: "Bot Tala",
    joinedAt: "2026-08-26T11:00:00.000Z",
    status: "Assigned",
  },
  {
    id: 104,
    passenger: "Sadia",
    pickup: "Medical",
    destination: "Transport",
    joinedAt: "2026-08-27T10:00:00.000Z",
    status: "Cancelled",
  },
];

describe("AdminRideRequestsPage", () => {
  beforeEach(() => {
    mockGetRideRequests.mockResolvedValue({ data: REQUESTS });
  });

  it("renders ride requests returned by the API", async () => {
    render(React.createElement(AdminRideRequestsPage));

    expect(await screen.findByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#104")).toBeInTheDocument();
  });

  it("filters requests by database status", async () => {
    render(React.createElement(AdminRideRequestsPage));
    await screen.findByText("#101");

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "Assigned" },
    });

    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.queryByText("#101")).not.toBeInTheDocument();
  });

  it("filters requests by passenger name", async () => {
    render(React.createElement(AdminRideRequestsPage));
    await screen.findByText("#101");

    fireEvent.change(screen.getByPlaceholderText(/search passenger/i), {
      target: { value: "Sadia" },
    });

    expect(screen.getByText("#104")).toBeInTheDocument();
    expect(screen.queryByText("#101")).not.toBeInTheDocument();
  });

  it("shows an empty state when filters match no API records", async () => {
    render(React.createElement(AdminRideRequestsPage));
    await screen.findByText("#101");

    fireEvent.change(screen.getByPlaceholderText(/search passenger/i), {
      target: { value: "Unknown User" },
    });

    expect(
      screen.getByText(/no ride requests match the selected filters/i)
    ).toBeInTheDocument();
  });
});
