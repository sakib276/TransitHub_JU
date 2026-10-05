import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import rideRequestRoutes from "./features/ride-request/routes/ride-request-routes.js";

/**
 * Configures the Express application and mounts health, Swagger, and API routes.
 *
 * @type {object}
 */
const app = express();

app.use(cors());
app.use(express.json());

/**
 * Reports backend process health.
 *
 * @swagger
 * /health:
 *   get:
 *     operationId: getHealth
 *     summary: Check API process health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API process is running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 service: { type: string, example: transithub-ju-backend }
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "transithub-ju-backend" });
});

app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", rideRequestRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

export default app;
