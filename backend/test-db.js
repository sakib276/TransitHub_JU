const sequelize = require("./src/config/database");

/**
 * Tests the connection between the backend and MySQL database.
 *
 * @module testDb
 */
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

testDatabaseConnection();
