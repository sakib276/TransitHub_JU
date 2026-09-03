import { describe, expect, it, vi } from "vitest";

vi.mock("../services/queueService.js", () => ({
	joinQueue: vi.fn(),
	getQueue: vi.fn(),
	assignPassenger: vi.fn(),
	markNoShow: vi.fn(),
	createPriorityRequest: vi.fn(),
}));

import { joinQueue, getQueue } from "../controllers/queueController.js";
import * as queueService from "../services/queueService.js";

const response = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });

describe("queueController", () => {
	it("returns a created queue entry", async () => {
		const res = response();
		queueService.joinQueue.mockResolvedValue({ queueEntry: { id: 1 } });

		await joinQueue({ body: { passenger_id: 1 } }, res);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ queueEntry: { id: 1 } });
	});

	it("returns queue service errors as bad requests", async () => {
		const res = response();
		queueService.getQueue.mockRejectedValue(new Error("Invalid pickup location."));

		await getQueue({ params: { pickupId: "bad" } }, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Invalid pickup location." });
	});
});
