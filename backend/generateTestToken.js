require("dotenv").config();

const jwt = require("jsonwebtoken");

/**
 * Generates a temporary JWT for local testing.
 *
 * @returns {void}
 */
function generateTestToken() {
  const token = jwt.sign(
    {
      userId: 2,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  console.log("\nTemporary test token:\n");
  console.log(token);
  console.log("\n");
}

generateTestToken();