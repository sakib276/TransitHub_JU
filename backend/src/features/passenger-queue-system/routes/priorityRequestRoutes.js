import express from "express";
import upload from "../../../middleware/upload.js";
import {
	approveRequest,
	createPriorityRequest,
	listPendingPriorityRequests,
	rejectRequest,
} from "../controllers/priorityRequestController.js";

const router = express.Router();

router.post("/", upload.single("proof"), createPriorityRequest);
router.get("/pending", listPendingPriorityRequests);
router.patch("/:id/approve", approveRequest);
router.patch("/:id/reject", rejectRequest);

export default router;