/**
 * @fileoverview Controller hook for vehicle availability, selection, and passenger actions.
 * @module features/available-vehicles/controllers/useAvailableVehiclesController
 */

import { useCallback, useEffect, useState } from 'react';
import { getAvailableVehicles, reserveVehicleSeat } from '../models/availableVehiclesModel';

/**
 * Manages the state and user actions for the Available Vehicles view.
 * @returns {Object} View state and actions.
 */
export const useAvailableVehiclesController = () => {
  const [selectedLocationId, setSelectedLocationId] = useState('cse');
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [isQueued, setIsQueued] = useState(false);

  /** Fetches the currently selected location's active vehicles. */
  const refreshVehicles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const availableVehicles = await getAvailableVehicles(selectedLocationId);
      setVehicles(availableVehicles);
      setLastUpdated(new Date());
    } catch (error) {
      setVehicles([]);
      setErrorMessage(error.message || 'We could not load vehicle availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    refreshVehicles();
    const refreshInterval = window.setInterval(refreshVehicles, 30000);
    return () => window.clearInterval(refreshInterval);
  }, [refreshVehicles]);

  /**
   * Requests one seat on a selected vehicle.
   * @param {string} vehicleId - Selected vehicle identifier.
   * @returns {Promise<void>}
   */
  const requestRide = async (vehicleId) => {
    if (hasActiveRequest) {
      setErrorMessage('You already have an active ride request.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await reserveVehicleSeat(vehicleId);
      setHasActiveRequest(true);
      setSuccessMessage('Ride request sent. The driver will be notified.');
      await refreshVehicles();
    } catch (error) {
      setErrorMessage(error.message || 'Your request could not be submitted. Please try again.');
    }
  };

  /** Joins the location queue when a suitable vehicle is not available. */
  const joinQueue = () => {
    setErrorMessage('');
    setIsQueued(true);
    setSuccessMessage('You joined the queue. We will notify you when a vehicle is available.');
  };

  return {
    selectedLocationId,
    setSelectedLocationId,
    vehicles,
    isLoading,
    errorMessage,
    successMessage,
    lastUpdated,
    hasActiveRequest,
    isQueued,
    refreshVehicles,
    requestRide,
    joinQueue,
  };
};
