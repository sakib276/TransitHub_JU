import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/PriorityRequest.js", () => ({
	default: { create: vi.fn(), findAll: vi.fn(), findByPk: vi.fn() },
}));
vi.mock("../models/QueueEntry.js", () => ({
	default: { update: vi.fn() },
}));

import PriorityRequest from "../models/PriorityRequest.js";
import QueueEntry from "../models/QueueEntry.js";
import {
	approvePriorityRequest,
	getPendingPriorityRequests,
	rejectPriorityRequest,
	submitPriorityRequest,
} from "../services/priorityRequestService.js";

describe("priorityRequestService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("submits a pending request with its proof path", async () => {
		const request = { id: 1, status: "Pending" };
		PriorityRequest.create.mockResolvedValue(request);

		await expect(submitPriorityRequest({
			queue_entry_id: "7",
			passenger_id: "3",
			reason: "Medical emergency",
			proof_path: "/uploads/proof.pdf",
		})).resolves.toBe(request);

		expect(PriorityRequest.create).toHaveBeenCalledWith({
			queue_entry_id: "7",
			passenger_id: "3",
			reason: "Medical emergency",
			proof_path: "/uploads/proof.pdf",
			status: "Pending",
		});
	});

	it("rejects incomplete requests before touching the database", async () => {
		await expect(submitPriorityRequest()).rejects.toThrow(/required/);
		expect(PriorityRequest.create).not.toHaveBeenCalled();
	});

	it("approves a request and promotes its queue entry", async () => {
		const request = {
			id: 4,
			queue_entry_id: 8,
			status: "Pending",
			save: vi.fn(),
		};
		PriorityRequest.findByPk.mockResolvedValue(request);

		await approvePriorityRequest(4);

		expect(request.status).toBe("Approved");
		expect(request.save).toHaveBeenCalled();
		expect(QueueEntry.update).toHaveBeenCalledWith(
			{ priority: true },
			{ where: { id: 8 } }
		);
	});

	it("lists pending requests oldest first", async () => {
		PriorityRequest.findAll.mockResolvedValue([]);

		await getPendingPriorityRequests();

		expect(PriorityRequest.findAll).toHaveBeenCalledWith({
			where: { status: "Pending" },
			order: [["created_at", "ASC"]],
		});
	});

	it("rejects a pending request without promoting its queue entry", async () => {
		const request = { status: "Pending", save: vi.fn() };
		PriorityRequest.findByPk.mockResolvedValue(request);

		await rejectPriorityRequest(5, "Invalid proof");

		expect(request.status).toBe("Rejected");
		expect(request.review_reason).toBe("Invalid proof");
		expect(QueueEntry.update).not.toHaveBeenCalled();
	});
});
