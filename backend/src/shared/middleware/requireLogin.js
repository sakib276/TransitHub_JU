import jwt from 'jsonwebtoken';

/**
 * Middleware: only lets the request continue if the user is logged in.
 *
 * How login works (from the feature/registration-login branch):
 *   1. The user logs in. The login backend creates a JWT token that contains
 *      { sub: <users.user_id>, role: <users.role> } and signs it with JWT_SECRET.
 *   2. The frontend saves that token and sends it with every request in the header:
 *        Authorization: Bearer <token>
 *
 * This middleware checks the token and, if it's valid, saves the user on
 * req.user = { userId, role } so the controller knows who is asking.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {Function} next - Calls the next handler.
 * @returns {void}
 */
export function requireLogin(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Please log in first.' });
    return;
  }

  try {
    // Same secret and issuer that the login backend used to create the token.
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'transithub-ju' });
    req.user = { userId: Number(payload.sub), role: payload.role };
    next();
  } catch {
    // Wrong secret, edited token, or expired token.
    res.status(401).json({ message: 'Your login has expired. Please log in again.' });
  }
}

/**
 * Middleware factory: only lets users with the given role continue.
 * Must be used AFTER requireLogin.
 *
 * Example: requireRole('Passenger')
 *
 * @param {string} role - One of the users.role values: 'Passenger', 'Driver', 'Admin'.
 * @returns {Function} Express middleware.
 */
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(403).json({ message: `Only a ${role} can do this.` });
      return;
    }

    next();
  };
}
