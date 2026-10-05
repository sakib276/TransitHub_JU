import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/api";

/**
 * Loads locations and exposes the ride-request API to feature pages.
 *
 * @returns {object} Ride-request data, loading state, errors, and API actions.
 */
export default function useRideRequest({ shouldLoadLocations = true } = {}) {
  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [error, setError] = useState("");

  const loadLocations = useCallback(async () => {
    setIsLoadingLocations(true);

    try {
      const response = await api.getLocations();
      setLocations(response.data);
      setError("");
      return response.data;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setIsLoadingLocations(false);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoadLocations) {
      setIsLoadingLocations(false);
      return;
    }

    loadLocations().catch(() => {});
  }, [loadLocations, shouldLoadLocations]);

  const runRequest = useCallback(async (request) => {
    setError("");

    try {
      return await request();
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }, []);

  const getRideRequests = useCallback(
    (filters) => runRequest(() => api.getRideRequests(filters)),
    [runRequest]
  );
  const getAvailableDrivers = useCallback(
    (seatsNeeded) => runRequest(() => api.getAvailableDrivers(seatsNeeded)),
    [runRequest]
  );
  const getDriverVehicle = useCallback(
    (driverId, vehicleId) =>
      runRequest(() => api.getDriverVehicle(driverId, vehicleId)),
    [runRequest]
  );
  const createRideRequest = useCallback(
    (payload) => runRequest(() => api.createRideRequest(payload)),
    [runRequest]
  );
  const acceptRideRequest = useCallback(
    (id, payload) => runRequest(() => api.acceptRideRequest(id, payload)),
    [runRequest]
  );
  const rejectRideRequest = useCallback(
    (id, driverId) => runRequest(() => api.rejectRideRequest(id, driverId)),
    [runRequest]
  );
  const updateDriverStatus = useCallback(
    (driverId, vehicleId, status) =>
      runRequest(() => api.updateDriverStatus(driverId, vehicleId, status)),
    [runRequest]
  );

  return {
    locations,
    isLoadingLocations,
    error,
    setError,
    loadLocations,
    getRideRequests,
    getAvailableDrivers,
    getDriverVehicle,
    createRideRequest,
    acceptRideRequest,
    rejectRideRequest,
    updateDriverStatus,
  };
}