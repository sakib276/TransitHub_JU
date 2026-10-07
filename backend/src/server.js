import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Starts the TransitHub JU HTTP server.
 *
 * @returns {object} The listening HTTP server instance.
 */
export function startServer() {
  return app.listen(PORT, () => {
    console.log(`TransitHub JU backend running on http://localhost:${PORT}`);
  });
}

startServer();
