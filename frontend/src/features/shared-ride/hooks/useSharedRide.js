/**
 * @fileoverview Custom state hook for Shared Ride feature managing role detection,
 * filters, modal states, alerts, and service mutations.
 * @module features/shared-ride/hooks/useSharedRide
 * @author Nazmus Sakib
 */

import { useState, useEffect, useCallback } from 'react';
import { sharedRideService } from '../services/sharedRideService';

export const useSharedRide = () => {
  // Read active role from auth session/localStorage (fallback to 'passenger')
  const getInitialUserRole = () => {
    try {
      const storedAuthUser = localStorage.getItem('transithub_user') || localStorage.getItem('currentUser');
      if (storedAuthUser) {
        const parsed = JSON.parse(storedAuthUser);
        if (parsed.role) return parsed.role.toLowerCase();
      }
      const directRole = localStorage.getItem('user_role') || localStorage.getItem('role');
      if (directRole) return directRole.toLowerCase();
    } catch (e) {
      // JSON parse fallback
    }
    return 'passenger';
  };

  const [currentUserRole, setCurrentUserRole] = useState(getInitialUserRole);
  const [allRidesList, setAllRidesList] = useState([]);
  const [filteredRidesList, setFilteredRidesList] = useState([]);
  const [searchPickup, setSearchPickup] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationAlert, setNotificationAlert] = useState(null);
  const [systemAnalytics, setSystemAnalytics] = useState(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedRideForAction, setSelectedRideForAction] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const rides = await sharedRideService.getAllRides();
    const analytics = await sharedRideService.getSystemAnalytics();
    setAllRidesList(rides);
    setSystemAnalytics(analytics);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const result = sharedRideService.filterRides(searchPickup, searchDestination, allRidesList);
    setFilteredRidesList(result);
  }, [searchPickup, searchDestination, allRidesList]);

  const showNotification = (message, type = 'success') => {
    setNotificationAlert({ message, type });
    setTimeout(() => setNotificationAlert(null), 4000);
  };

  const handleSwapSearchLocations = () => {
    setSearchPickup(searchDestination);
    setSearchDestination(searchPickup);
  };

  const handleJoinRide = async (rideId, passengerName = 'Nazmus Sakib') => {
    const res = await sharedRideService.joinRide(rideId, { name: passengerName });
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      showNotification(res.responseMessage, 'success');
    } else {
      showNotification(res.responseMessage, 'error');
    }
  };

  const handleCancelBooking = async (rideId, passengerName = 'Nazmus Sakib') => {
    const res = await sharedRideService.cancelBooking(rideId, passengerName);
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      showNotification('Your seat reservation has been released.', 'info');
    }
  };

  const handleCancelEntireRide = async (rideId, role) => {
    if (!window.confirm('Are you sure you want to cancel this entire shared ride trip?')) return;
    const res = await sharedRideService.cancelEntireRide(rideId, role);
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      showNotification('The ride has been cancelled and co-passengers notified.', 'info');
    }
  };

  const handleCreateRideSubmit = async (formData) => {
    const duplicate = sharedRideService.findDuplicateRide(formData.pickupLocation, formData.destinationLocation, allRidesList);
    if (duplicate) {
      const confirmCreate = window.confirm(
        `[Duplicate Detected] An open shared ride (${duplicate.pickupLocation} ➔ ${duplicate.destinationLocation}) departing at ${duplicate.departureTime} already exists. Do you still want to publish a new one?`
      );
      if (!confirmCreate) return false;
    }

    const res = await sharedRideService.createRide(formData);
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      setIsCreateModalOpen(false);
      showNotification('Shared ride request opened successfully!', 'success');
      return true;
    }
    return false;
  };

  const handleEditRideSubmit = async (rideId, updatedFields) => {
    const res = await sharedRideService.editRideDetails(rideId, updatedFields);
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      setIsEditModalOpen(false);
      setSelectedRideForAction(null);
      showNotification(res.message, 'success');
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleDriverResponse = async (rideId, action) => {
    const res = await sharedRideService.driverRespondRide(rideId, action);
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      showNotification(`Ride ${action.toLowerCase()} by driver.`, 'success');
    }
  };

  const handleNoShow = async (rideId, passengerId) => {
    const res = await sharedRideService.handleNoShow(rideId, passengerId);
    if (res.isSuccessful) {
      setAllRidesList(res.updatedList);
      showNotification('Passenger marked as no-show and seat opened up.', 'info');
    }
  };

  const handleFeedbackSubmit = async (payload) => {
    const res = await sharedRideService.submitRideReview(payload);
    if (res.isSuccessful) {
      setIsRateModalOpen(false);
      setSelectedRideForAction(null);
      showNotification(res.message, 'success');
      loadData();
    }
  };

  return {
    currentUserRole,
    setCurrentUserRole,
    allRidesList,
    filteredRidesList,
    searchPickup,
    setSearchPickup,
    searchDestination,
    setSearchDestination,
    handleSwapSearchLocations,
    isLoading,
    notificationAlert,
    systemAnalytics,
    handleJoinRide,
    handleCancelBooking,
    handleCancelEntireRide,
    handleCreateRideSubmit,
    handleEditRideSubmit,
    handleDriverResponse,
    handleNoShow,
    handleFeedbackSubmit,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isRateModalOpen,
    setIsRateModalOpen,
    selectedRideForAction,
    setSelectedRideForAction
  };
};