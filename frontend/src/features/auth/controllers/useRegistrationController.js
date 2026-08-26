/**
 * @fileoverview Registration Controller hook managing input validation and role-specific registration flows.
 * @module controllers/useRegistrationController
 */

import { useState } from 'react';
import { 
  validateStrongPassword, 
  validatePhoneNumber, 
  validateEmail, 
  registerUserRecord 
} from '../models/authModel';

/**
 * Custom hook to handle passenger, driver, and admin registration logic.
 * @returns {Object} Controller state and actions.
 */
export const useRegistrationController = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Registers a student/staff passenger.
   * @param {Object} payload
   * @param {string} payload.fullName
   * @param {string} payload.email
   * @param {string} payload.phone
   * @param {string} payload.password
   * @param {string} payload.confirmPassword
   * @returns {boolean} Success status
   */
  const registerPassenger = async ({ fullName, email, phone, password, confirmPassword }) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return false;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please provide a valid email address.');
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      setErrorMessage('Please provide a valid 11-digit phone number (e.g. 017XXXXXXXX).');
      return false;
    }

    if (!validateStrongPassword(password)) {
      setErrorMessage('Password must be at least 8 characters and include uppercase, lowercase, and numeric characters.');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return false;
    }

    try {
      setLoading(true);
      registerUserRecord({
        fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password, // In real backend integration, passwords must always be hashed before storing
        role: 'passenger'
      });
      setSuccessMessage('Registration successful! Verification code has been sent. You can now log in.');
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a vehicle driver.
   * @param {Object} payload
   * @param {string} payload.fullName
   * @param {string} payload.phone
   * @param {string} payload.nid
   * @param {string} payload.vehicleType
   * @returns {boolean} Success status
   */
  const registerDriver = async ({ fullName, phone, nid, vehicleType }) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !phone || !nid || !vehicleType) {
      setErrorMessage('All driver details are mandatory.');
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      setErrorMessage('Please provide a valid 11-digit mobile number.');
      return false;
    }

    if (nid.length < 10) {
      setErrorMessage('Please provide a valid National ID (NID).');
      return false;
    }

    try {
      setLoading(true);
      registerUserRecord({
        fullName,
        phone: phone.trim(),
        nid: nid.trim(),
        vehicleType,
        role: 'driver'
      });
      setSuccessMessage('Driver profile registered! You can now log in with OTP verification.');
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a campus administrator.
   * @param {Object} payload
   * @param {string} payload.fullName
   * @param {string} payload.email
   * @param {string} payload.adminPasscode
   * @param {string} payload.password
   * @returns {boolean} Success status
   */
  const registerAdmin = async ({ fullName, email, adminPasscode, password }) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !adminPasscode || !password) {
      setErrorMessage('All administrative fields must be filled.');
      return false;
    }

    if (adminPasscode !== 'JU_ADMIN_AUTH_2026') {
      setErrorMessage('Invalid administrative authorization passcode.');
      return false;
    }

    if (!validateStrongPassword(password)) {
      setErrorMessage('Password must be at least 8 characters with upper, lower, and number.');
      return false;
    }

    try {
      setLoading(true);
      registerUserRecord({
        fullName,
        email: email.trim().toLowerCase(),
        role: 'admin',
        password
      });
      setSuccessMessage('Administrator account registered successfully.');
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMessage,
    successMessage,
    registerPassenger,
    registerDriver,
    registerAdmin
  };
};