/**
 * @fileoverview Registration Controller hook managing input validation and role-specific registration flows.
 * @module controllers/useRegistrationController
 */

import { useState } from 'react';
import { authRequest } from '../models/authApi';
import { 
  validateStrongPassword, 
  validatePhoneNumber, 
  validateEmail
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
      await authRequest('/register/passenger', {
        fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password
      });
      setSuccessMessage('Registration successful. You can now log in.');
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
  const registerDriver = async ({ fullName, email, phone, nid, vehicleType }) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !phone || !nid || !vehicleType) {
      setErrorMessage('All driver details are mandatory.');
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      setErrorMessage('Please provide a valid 11-digit mobile number.');
      return false;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please provide a valid email address.');
      return false;
    }

    if (nid.length < 10) {
      setErrorMessage('Please provide a valid National ID (NID).');
      return false;
    }

    try {
      setLoading(true);
      await authRequest('/register/driver', {
        fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        nid: nid.trim(),
        vehicleType
      });
      setSuccessMessage('Driver account created. An administrator must assign your vehicle before you begin service.');
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
  const registerAdmin = async ({ fullName, email, phone, adminPasscode, password }) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !phone || !adminPasscode || !password) {
      setErrorMessage('All administrative fields must be filled.');
      return false;
    }

    if (!validateEmail(email) || !validatePhoneNumber(phone)) {
      setErrorMessage('Enter a valid email address and 11-digit phone number.');
      return false;
    }

    if (!validateStrongPassword(password)) {
      setErrorMessage('Password must be at least 8 characters with upper, lower, and number.');
      return false;
    }

    try {
      setLoading(true);
      await authRequest('/register/admin', {
        fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        adminPasscode,
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
