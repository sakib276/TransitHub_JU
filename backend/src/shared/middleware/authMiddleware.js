const jwt = require("jsonwebtoken");

/**
 * Authenticates a user using a JWT bearer token.
 *
 * @module authMiddleware
 */

/**
 * Attaches the authenticated user to the request, or rejects it.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Passes control to the next handler.
 * @returns {void}
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decodedToken);

    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    return next();
  } catch (error) {
    console.error("JWT error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authMiddleware;