const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * Creates the Sequelize connection to the TransitHub_JU database.
 *
 * @module database
 */

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;