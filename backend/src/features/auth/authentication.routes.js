import { Router } from 'express';
import { loginPassenger, loginAdmin, requestDriverOtp, verifyDriverOtp, registerPassenger, registerDriver, registerAdmin, requestPasswordReset, resetPassword } from './authentication.controller.js';

const router = Router();
router.post('/register/passenger', registerPassenger);
router.post('/register/driver', registerDriver);
router.post('/register/admin', registerAdmin);
router.post('/login/passenger', loginPassenger);
router.post('/login/admin', loginAdmin);
router.post('/login/driver/request-otp', requestDriverOtp);
router.post('/login/driver/verify-otp', verifyDriverOtp);
router.post('/password-reset/request', requestPasswordReset);
router.post('/password-reset/complete', resetPassword);
export default router;
