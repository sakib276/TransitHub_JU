import * as auth from './authentication.service.js';

/** Run an auth service action and map expected errors to safe API responses. */
/** Execute a service operation and return a consistent JSON response without leaking internal errors. */
async function handle(res, action, status = 200) {
  try { res.status(status).json({ success: true, data: await action() }); }
  catch (error) {
    if (error.status) {
      if (error.retryAfter) res.set('Retry-After', String(error.retryAfter));
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      console.error('Authentication request failed:', error.message);
      res.status(500).json({ success: false, message: 'Authentication request failed.' });
    }
  }
}

/** Authenticate a passenger with email and password. */
export const loginPassenger = (req, res) => handle(res, () => auth.loginPassenger(req.body));
/** Send an OTP to a driver's registered email. */
export const requestDriverOtp = (req, res) => handle(res, () => auth.requestDriverOtp(req.body));
/** Verify a driver's OTP and issue a login token. */
export const verifyDriverOtp = (req, res) => handle(res, () => auth.verifyDriverOtp(req.body));
/** Create a passenger account. */
export const registerPassenger = (req, res) => handle(res, () => auth.registerPassenger(req.body), 201);
/** Create a Driver identity for later administrator profile/vehicle assignment. */
export const registerDriver = (req, res) => handle(res, () => auth.registerDriver(req.body), 201);
/** Create an Admin account after server-side enrollment-code verification. */
export const registerAdmin = (req, res) => handle(res, () => auth.registerAdmin(req.body), 201);
/** Send a password reset link without disclosing whether the email exists. */
export const requestPasswordReset = (req, res) => handle(res, () => auth.requestPasswordReset(req.body));
/** Replace a password using a one-time reset token. */
export const resetPassword = (req, res) => handle(res, () => auth.resetPassword(req.body));
