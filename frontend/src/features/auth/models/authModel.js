/**
 * @fileoverview Auth Model handling data validation, storage operations, and local state.
 * @module models/authModel
 */

const STORAGE_USERS_KEY = 'th_registered_users';
const STORAGE_SESSION_KEY = 'th_session_user';
const STORAGE_LOCKOUT_KEY = 'th_auth_lockout';
const STORAGE_ATTEMPTS_KEY = 'th_auth_failed_attempts';

/**
 * Validates strong password rules: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number.
 * @param {string} password - The password string to validate.
 * @returns {boolean} True if password meets security standards.
 */
export const validateStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

/**
 * Validates standard phone format.
 * @param {string} phone - Bangladeshi 11-digit format (e.g. 017XXXXXXXX).
 * @returns {boolean} True if phone number is valid.
 */
export const validatePhoneNumber = (phone) => {
  const regex = /^01[3-9]\d{8}$/;
  return regex.test(phone.trim());
};

/**
 * Validates email format.
 * @param {string} email - Email address string.
 * @returns {boolean} True if email is properly formatted.
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Retrieves all registered users from local state storage.
 * @returns {Array<Object>} List of registered user entities.
 */
export const getStoredUsers = () => {
  const raw = localStorage.getItem(STORAGE_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

/**
 * Persists a new user entity to local storage.
 * @param {Object} userData - User record to save.
 * @returns {Object} Saved user record.
 * @throws {Error} If user with phone or email already exists.
 */
export const registerUserRecord = (userData) => {
  const users = getStoredUsers();
  
  const duplicate = users.find(u => 
    (userData.email && u.email === userData.email) || 
    (userData.phone && u.phone === userData.phone)
  );

  if (duplicate) {
    throw new Error('An account with this email or phone number is already registered.');
  }

  const record = {
    ...userData,
    id: 'usr_' + Date.now(),
    createdAt: new Date().toISOString(),
    isVerified: true
  };

  users.push(record);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  return record;
};

/**
 * Sets current logged-in user in session.
 * @param {Object} user - User session entity.
 */
export const setSessionUser = (user) => {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
};

/**
 * Retrieves active session user.
 * @returns {Object|null} Active session entity or null.
 */
export const getSessionUser = () => {
  const raw = localStorage.getItem(STORAGE_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

/**
 * Clears current session user.
 */
export const clearSession = () => {
  localStorage.removeItem(STORAGE_SESSION_KEY);
};

export {
  STORAGE_LOCKOUT_KEY,
  STORAGE_ATTEMPTS_KEY
};