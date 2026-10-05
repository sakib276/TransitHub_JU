/**
 * @fileoverview Auth Model handling data validation, storage operations, and local state.
 * @module models/authModel
 */

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
