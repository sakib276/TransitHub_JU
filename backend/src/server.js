require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

/**
 * Starts the TransitHub_JU backend server.
 *
 * @module server
 */

const DEFAULT_PORT = 5000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

/**
 * Verifies the database connection and starts listening for requests.
 *
 * @returns {Promise<void>} Resolves once the server is listening.
 */
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();