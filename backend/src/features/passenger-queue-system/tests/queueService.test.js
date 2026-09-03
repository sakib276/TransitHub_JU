import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/QueueEntry.js", () => ({
	default: { create: vi.fn(), findAll: vi.fn(), findByPk: vi.fn() },
}));
vi.mock("../models/QueueAssignment.js", () => ({
	default: { create: vi.fn() },
}));
vi.mock("../models/PriorityRequest.js", () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

import QueueEntry from "../models/QueueEntry.js";
import QueueAssignment from "../models/QueueAssignment.js";
import PriorityRequest from "../models/PriorityRequest.js";
import {
	assignPassenger,
	createPriorityRequest,
	getQueue,
	joinQueue,
	markNoShow,
} from "../services/queueService.js";

describe("queueService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("rejects joining with the same pickup and destination", async () => {
		await expect(joinQueue({ passenger_id: 1, pickup_location_id: 2, destination_location_id: 2, seats_needed: 1 })).rejects.toThrow(/different/);
		expect(QueueEntry.create).not.toHaveBeenCalled();
	});

	it("gets waiting entries in priority order", async () => {
		QueueEntry.findAll.mockResolvedValue([]);

		await getQueue("2");

		expect(QueueEntry.findAll).toHaveBeenCalledWith({
			where: { pickup_location_id: 2, status: "Waiting" },
			order: [["priority", "DESC"], ["joined_at", "ASC"]],
		});
	});

	it("assigns a passenger and records the assignment", async () => {
		const passenger = { id: 4, status: "Waiting", seats_needed: 1, pickup_location_id: 2, save: vi.fn() };
		QueueEntry.findByPk.mockResolvedValue(passenger);
		QueueEntry.findAll.mockResolvedValue([]);

		await expect(assignPassenger(4, { driver_id: 3, vehicle_id: 5, availableSeats: 2 })).resolves.toEqual({ message: "Passenger assigned successfully.", seatsUsed: 1 });
		expect(QueueAssignment.create).toHaveBeenCalledWith({ queue_entry_id: 4, driver_id: 3, vehicle_id: 5, seats_assigned: 1 });
	});

	it("creates a priority request for the owning waiting passenger", async () => {
		QueueEntry.findByPk.mockResolvedValue({ id: 4, passenger_id: 3, status: "Waiting" });
		PriorityRequest.findOne.mockResolvedValue(null);
		PriorityRequest.create.mockResolvedValue({ status: "Pending" });

		await expect(createPriorityRequest({ queue_entry_id: 4, passenger_id: 3, reason: "Medical", proof_path: "/proof.pdf" })).resolves.toMatchObject({ status: "Pending" });
	});

	it("marks a waiting passenger as no-show", async () => {
		const passenger = { status: "Waiting", pickup_location_id: 2, save: vi.fn() };
		QueueEntry.findByPk.mockResolvedValue(passenger);
		QueueEntry.findAll.mockResolvedValue([]);

		await markNoShow(4);

		expect(passenger.status).toBe("No-show");
		expect(passenger.save).toHaveBeenCalled();
	});
});
