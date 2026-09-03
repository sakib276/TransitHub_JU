import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import queueRoutes from "./features/passenger-queue-system/routes/queueRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/queue", queueRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});