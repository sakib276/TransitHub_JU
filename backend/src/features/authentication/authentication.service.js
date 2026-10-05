import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import nodemailer from 'nodemailer';
import pool from '../../config/database.js';

const LOCK_MS = 10 * 60 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const RESET_TTL_MS = 30 * 60 * 1000;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);

/** Normalize and validate email addresses before database lookups. */
export function normalizeEmail(email) {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
  }
  return email.trim().toLowerCase();
}

/** Validate password policy shared by registration and password reset. */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 72
      || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    throw Object.assign(new Error('Password must be 8–72 characters with uppercase, lowercase, and a number.'), { status: 400 });
  }
}

/** Send account challenges by email; SMTP configuration is required in production. */
async function sendMail({ to, subject, text }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw Object.assign(new Error('Email delivery is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.'), { status: 503 });
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
}

/** Create a signed bearer token for a successfully authenticated account. */
function createSession(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw Object.assign(new Error('JWT_SECRET must be configured with at least 32 characters.'), { status: 503 });
  }
  return jwt.sign({ sub: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h', issuer: 'transithub-ju' });
}

/** Get or create the companion security row required for account counters. */
async function ensureSecurityRow(connection, userId) {
  await connection.execute('INSERT IGNORE INTO auth_security (user_id) VALUES (?)', [userId]);
}

/** Read a database lock and expose remaining time without disclosing account state. */
function getLockSeconds(value) {
  const remaining = value ? Math.ceil((new Date(value).getTime() - Date.now()) / 1000) : 0;
  return remaining > 0 ? remaining : 0;
}

/** Authenticate a Passenger by email/password and enforce a persistent five-failure lockout. */
export async function loginPassenger({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (typeof password !== 'string' || !password) throw Object.assign(new Error('Password is required.'), { status: 400 });
  const connection = await pool.getConnection();
  let committed = false;
  try {
    await connection.beginTransaction();
    const [users] = await connection.execute("SELECT user_id, full_name, email, role, password_hash FROM users WHERE email = ? AND role = 'Passenger' LIMIT 1", [normalizedEmail]);
    const user = users[0];
    if (!user) {
      await bcrypt.compare(password, '$2a$12$C6UzMDM.H6dfI/f/IKcEe.0zYqgCzSx4N7S1kzFfR0Bk1xv3z8F9a');
      throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
    }
    await ensureSecurityRow(connection, user.user_id);
    const [rows] = await connection.execute('SELECT password_failures, password_locked_until FROM auth_security WHERE user_id = ? FOR UPDATE', [user.user_id]);
    const lockSeconds = getLockSeconds(rows[0]?.password_locked_until);
    if (lockSeconds) throw Object.assign(new Error(`Account temporarily locked. Try again in ${Math.ceil(lockSeconds / 60)} minute(s).`), { status: 423, retryAfter: lockSeconds });
    if (rows[0]?.password_locked_until) await connection.execute('UPDATE auth_security SET password_failures = 0, password_locked_until = NULL WHERE user_id = ?', [user.user_id]);
    if (!(await bcrypt.compare(password, user.password_hash))) {
      const failures = (rows[0]?.password_failures || 0) + 1;
      const lockUntil = failures >= 5 ? new Date(Date.now() + LOCK_MS) : null;
      await connection.execute('UPDATE auth_security SET password_failures = ?, password_locked_until = ? WHERE user_id = ?', [lockUntil ? 0 : failures, lockUntil, user.user_id]);
      await connection.commit();
      committed = true;
      throw Object.assign(new Error(lockUntil ? 'Too many failed attempts. Account locked for 10 minutes.' : `Invalid email or password. ${5 - failures} attempt(s) remaining.`), { status: lockUntil ? 423 : 401, retryAfter: lockUntil ? 600 : undefined });
    }
    await connection.execute('UPDATE auth_security SET password_failures = 0, password_locked_until = NULL WHERE user_id = ?', [user.user_id]);
    const session = { token: createSession(user), user: { id: user.user_id, fullName: user.full_name, email: user.email, role: user.role } };
    await connection.commit();
    committed = true;
    return session;
  } catch (error) {
    if (!committed) await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

/** Send a hashed, short-lived OTP to an existing driver's registered email. */
export async function requestDriverOtp({ phone }) {
  if (typeof phone !== 'string' || !/^01[3-9]\d{8}$/.test(phone.trim())) throw Object.assign(new Error('Enter a valid 11-digit phone number.'), { status: 400 });
  const normalizedPhone = phone.trim();
  const [users] = await pool.execute("SELECT user_id, email FROM users WHERE phone = ? AND role = 'Driver' LIMIT 1", [normalizedPhone]);
  if (!users[0]) return { message: 'If a driver account matches that phone, an OTP will be sent.' };
  const user = users[0];
  const connection = await pool.getConnection();
  let committed = false;
  try {
    await connection.beginTransaction();
    await ensureSecurityRow(connection, user.user_id);
    const [rows] = await connection.execute('SELECT otp_sent_at, otp_locked_until FROM auth_security WHERE user_id = ? FOR UPDATE', [user.user_id]);
    const lockSeconds = getLockSeconds(rows[0]?.otp_locked_until);
    if (lockSeconds) throw Object.assign(new Error(`OTP login temporarily locked. Try again in ${Math.ceil(lockSeconds / 60)} minute(s).`), { status: 423, retryAfter: lockSeconds });
    const wait = OTP_COOLDOWN_MS - (Date.now() - new Date(rows[0]?.otp_sent_at || 0).getTime());
    if (wait > 0) throw Object.assign(new Error(`Please wait ${Math.ceil(wait / 1000)} seconds before requesting another OTP.`), { status: 429, retryAfter: Math.ceil(wait / 1000) });
    const otp = String(randomInt(0, 1000000)).padStart(6, '0');
    const otpHash = await bcrypt.hash(otp, bcryptRounds);
    await connection.execute('UPDATE auth_security SET otp_hash = ?, otp_expires_at = ?, otp_sent_at = ? WHERE user_id = ?', [otpHash, new Date(Date.now() + OTP_TTL_MS), new Date(), user.user_id]);
    await connection.commit();
    committed = true;
    try {
      await sendMail({ to: user.email, subject: 'TransitHub JU driver sign-in code', text: `Your sign-in code is ${otp}. It expires in 5 minutes. If you did not request it, ignore this email.` });
    } catch (error) {
      await pool.execute('UPDATE auth_security SET otp_hash = NULL, otp_expires_at = NULL WHERE user_id = ?', [user.user_id]);
      throw error;
    }
    return { message: 'If a driver account matches that phone, an OTP will be sent.' };
  } catch (error) {
    if (!committed) await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

/** Verify driver OTP, enforce expiry and block after five consecutive failures. */
export async function verifyDriverOtp({ phone, otp }) {
  if (typeof phone !== 'string' || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) throw Object.assign(new Error('Enter the 6-digit OTP and phone number.'), { status: 400 });
  const [users] = await pool.execute("SELECT user_id, full_name, email, phone, role FROM users WHERE phone = ? AND role = 'Driver' LIMIT 1", [phone.trim()]);
  const user = users[0];
  if (!user) throw Object.assign(new Error('Invalid or expired OTP.'), { status: 401 });
  const connection = await pool.getConnection();
  let committed = false;
  try {
    await connection.beginTransaction();
    await ensureSecurityRow(connection, user.user_id);
    const [rows] = await connection.execute('SELECT otp_hash, otp_expires_at, otp_failures, otp_locked_until FROM auth_security WHERE user_id = ? FOR UPDATE', [user.user_id]);
    const security = rows[0];
    const lockSeconds = getLockSeconds(security.otp_locked_until);
    if (lockSeconds) throw Object.assign(new Error(`OTP login temporarily locked. Try again in ${Math.ceil(lockSeconds / 60)} minute(s).`), { status: 423, retryAfter: lockSeconds });
    const valid = security.otp_hash && new Date(security.otp_expires_at).getTime() > Date.now() && await bcrypt.compare(otp, security.otp_hash);
    if (!valid) {
      const failures = (security.otp_failures || 0) + 1;
      const lockUntil = failures >= 5 ? new Date(Date.now() + LOCK_MS) : null;
      await connection.execute('UPDATE auth_security SET otp_failures = ?, otp_locked_until = ?, otp_hash = IF(?, NULL, otp_hash) WHERE user_id = ?', [lockUntil ? 0 : failures, lockUntil, Boolean(lockUntil), user.user_id]);
      await connection.commit();
      committed = true;
      throw Object.assign(new Error(lockUntil ? 'Too many invalid OTP attempts. Login blocked for 10 minutes.' : 'Invalid or expired OTP.'), { status: lockUntil ? 423 : 401, retryAfter: lockUntil ? 600 : undefined });
    }
    await connection.execute('UPDATE auth_security SET otp_hash = NULL, otp_expires_at = NULL, otp_failures = 0, otp_locked_until = NULL WHERE user_id = ?', [user.user_id]);
    const session = { token: createSession(user), user: { id: user.user_id, fullName: user.full_name, email: user.email, role: user.role } };
    await connection.commit();
    committed = true;
    return session;
  } catch (error) {
    if (!committed) await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

/** Register a passenger with a bcrypt password hash and existing users-table fields. */
export async function registerPassenger({ fullName, email, phone, password }) {
  const normalizedEmail = normalizeEmail(email);
  validatePassword(password);
  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) throw Object.assign(new Error('Enter a valid full name.'), { status: 400 });
  if (typeof phone !== 'string' || !/^01[3-9]\d{8}$/.test(phone.trim())) throw Object.assign(new Error('Enter a valid 11-digit phone number.'), { status: 400 });
  const hash = await bcrypt.hash(password, bcryptRounds);
  try {
    const [result] = await pool.execute("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'Passenger')", [fullName.trim(), normalizedEmail, phone.trim(), hash]);
    return { id: result.insertId, fullName: fullName.trim(), email: normalizedEmail, role: 'Passenger' };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw Object.assign(new Error('An account with this email or phone already exists.'), { status: 409 });
    throw error;
  }
}

/** Register a Driver identity for OTP login; profile/vehicle assignment remains in the drivers feature. */
export async function registerDriver({ fullName, email, phone, nid, vehicleType }) {
  const normalizedEmail = normalizeEmail(email);
  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) throw Object.assign(new Error('Enter a valid full name.'), { status: 400 });
  if (typeof phone !== 'string' || !/^01[3-9]\d{8}$/.test(phone.trim())) throw Object.assign(new Error('Enter a valid 11-digit phone number.'), { status: 400 });
  if (typeof nid !== 'string' || nid.trim().length < 10 || nid.trim().length > 50) throw Object.assign(new Error('Enter a valid license/NID number.'), { status: 400 });
  if (typeof vehicleType !== 'string' || !['Rickshaw (2 Seats)', 'Auto Rickshaw (4 Seats)', 'Campus Cart (6 Seats)'].includes(vehicleType)) throw Object.assign(new Error('Choose a supported vehicle category.'), { status: 400 });
  const randomPassword = randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(randomPassword, bcryptRounds);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'Driver')", [fullName.trim(), normalizedEmail, phone.trim(), hash]);
    await connection.execute('INSERT INTO driver_applications (user_id, license_number, requested_vehicle_type) VALUES (?, ?, ?)', [result.insertId, nid.trim(), vehicleType]);
    await connection.commit();
    return { id: result.insertId, fullName: fullName.trim(), email: normalizedEmail, role: 'Driver', message: 'Driver account created. An administrator must assign your vehicle before you begin service.' };
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw Object.assign(new Error('An account with this email or phone already exists.'), { status: 409 });
    throw error;
  } finally { connection.release(); }
}

/** Register an Admin identity only when the server-side enrollment code is configured and matches. */
export async function registerAdmin({ fullName, email, phone, password, adminPasscode }) {
  if (!process.env.ADMIN_REGISTRATION_CODE || typeof adminPasscode !== 'string'
      || adminPasscode.length !== process.env.ADMIN_REGISTRATION_CODE.length
      || !timingSafeTextEqual(adminPasscode, process.env.ADMIN_REGISTRATION_CODE)) {
    throw Object.assign(new Error('Invalid administrative authorization passcode.'), { status: 403 });
  }
  const normalizedEmail = normalizeEmail(email);
  validatePassword(password);
  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) throw Object.assign(new Error('Enter a valid full name.'), { status: 400 });
  if (typeof phone !== 'string' || !/^01[3-9]\d{8}$/.test(phone.trim())) throw Object.assign(new Error('Enter a valid 11-digit phone number.'), { status: 400 });
  const hash = await bcrypt.hash(password, bcryptRounds);
  try {
    const [result] = await pool.execute("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'Admin')", [fullName.trim(), normalizedEmail, phone.trim(), hash]);
    return { id: result.insertId, fullName: fullName.trim(), email: normalizedEmail, role: 'Admin' };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw Object.assign(new Error('An account with this email or phone already exists.'), { status: 409 });
    throw error;
  }
}

/** Compare enrollment secrets without data-dependent string comparison. */
function timingSafeTextEqual(left, right) {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

/** Start password reset with an opaque random token; store only its SHA-256 digest. */
export async function requestPasswordReset({ email }) {
  const normalizedEmail = normalizeEmail(email);
  const [users] = await pool.execute("SELECT user_id, email FROM users WHERE email = ? AND role = 'Passenger' LIMIT 1", [normalizedEmail]);
  if (!users[0]) return { message: 'If an account matches that email, reset instructions will be sent.' };
  const token = randomBytes(32).toString('hex');
  const digest = createHash('sha256').update(token).digest('hex');
  await pool.execute('INSERT IGNORE INTO auth_security (user_id) VALUES (?)', [users[0].user_id]);
  await pool.execute('UPDATE auth_security SET reset_token_hash = ?, reset_expires_at = ? WHERE user_id = ?', [digest, new Date(Date.now() + RESET_TTL_MS), users[0].user_id]);
  const resetUrl = `${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}?resetToken=${token}`;
  await sendMail({ to: users[0].email, subject: 'TransitHub JU password reset', text: `Reset your password using this one-time link (valid for 30 minutes): ${resetUrl}` });
  return { message: 'If an account matches that email, reset instructions will be sent.' };
}

/** Consume a one-time reset token and atomically replace the stored bcrypt hash. */
export async function resetPassword({ token, password }) {
  validatePassword(password);
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw Object.assign(new Error('Reset link is invalid or expired.'), { status: 400 });
  const digest = createHash('sha256').update(token).digest('hex');
  const hash = await bcrypt.hash(password, bcryptRounds);
  const [result] = await pool.execute('UPDATE users u JOIN auth_security a ON a.user_id = u.user_id SET u.password_hash = ?, a.reset_token_hash = NULL, a.reset_expires_at = NULL, a.password_failures = 0, a.password_locked_until = NULL WHERE a.reset_token_hash = ? AND a.reset_expires_at > NOW()', [hash, digest]);
  if (!result.affectedRows) throw Object.assign(new Error('Reset link is invalid or expired.'), { status: 400 });
  return { message: 'Password reset successfully. You can now sign in.' };
}
