import express from "express";
import { createPriorityRequest } from "../controllers/priorityRequestController.js";

const router = express.Router();

router.post("/", createPriorityRequest);

export default router;