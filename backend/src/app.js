import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import queueRoutes from "./features/passenger-queue-system/routes/queueRoutes.js";
import priorityRequestRoutes from "./features/passenger-queue-system/routes/priorityRequestRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/queue", queueRoutes);
app.use("/api/priority-requests", priorityRequestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});