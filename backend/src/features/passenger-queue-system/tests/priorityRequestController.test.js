import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/priorityRequestService.js", () => ({
	submitPriorityRequest: vi.fn(),
	getPendingPriorityRequests: vi.fn(),
	approvePriorityRequest: vi.fn(),
	rejectPriorityRequest: vi.fn(),
}));

import {
	createPriorityRequest,
	listPendingPriorityRequests,
} from "../controllers/priorityRequestController.js";
import {
	getPendingPriorityRequests,
	submitPriorityRequest,
} from "../services/priorityRequestService.js";

const response = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
});

describe("priorityRequestController", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passes uploaded proof paths to the service", async () => {
		const res = response();
		submitPriorityRequest.mockResolvedValue({ status: "Pending", id: 2 });

		await createPriorityRequest({
			body: { queue_entry_id: "7", passenger_id: "3", reason: "Medical" },
			file: { filename: "proof.pdf" },
		}, res);

		expect(submitPriorityRequest).toHaveBeenCalledWith({
			queue_entry_id: "7",
			passenger_id: "3",
			reason: "Medical",
			proof_path: "/uploads/priority-proofs/proof.pdf",
		});
		expect(res.status).toHaveBeenCalledWith(201);
	});

	it("returns pending requests", async () => {
		const res = response();
		getPendingPriorityRequests.mockResolvedValue([{ id: 1 }]);

		await listPendingPriorityRequests({}, res);

		expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
	});
});
