/**
 * @fileoverview Custom React hook managing fare selection state, calculations, and modal visibility.
 * @module features/fare/hooks/useFare
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import {
  getPredefinedFares,
  calculateFare,
  reportOvercharge
} from '../services/fareService';

/**
 * Hook to manage campus fare verification workflows.
 * @returns {{
 *   selectedPickupLocation: string,
 *   setSelectedPickupLocation: Function,
 *   selectedDestinationLocation: string,
 *   setSelectedDestinationLocation: Function,
 *   calculatedFareDetails: Object|null,
 *   activeFareChartList: Array<Object>,
 *   isReportModalVisible: boolean,
 *   setIsReportModalVisible: Function,
 *   handleCalculateFare: Function,
 *   handleSwapLocations: Function,
 *   handleSubmitOverchargeReport: Function
 * }}
 */
export const useFare = () => {
  const [selectedPickupLocation, setSelectedPickupLocation] = useState('');
  const [selectedDestinationLocation, setSelectedDestinationLocation] = useState('');
  const [calculatedFareDetails, setCalculatedFareDetails] = useState(null);
  const [activeFareChartList, setActiveFareChartList] = useState([]);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  // Initial load: Fetch predefined official campus fares from the backend API
  useEffect(() => {
    let isSubscribed = true;

    const loadFareMatrix = async () => {
      try {
        const fareData = await getPredefinedFares();
        if (isSubscribed && fareData) {
          // Supports both direct array responses and object-wrapped payloads
          const formattedList = Array.isArray(fareData)
            ? fareData
            : (fareData.fareChartData || []);
          setActiveFareChartList(formattedList);
        }
      } catch (error) {
        console.error('Failed to load fare chart from backend:', error);
      }
    };

    loadFareMatrix();

    return () => {
      isSubscribed = false;
    };
  }, []);

  /**
   * Triggers asynchronous fare comparison evaluation from the backend based on active selection.
   * @async
   */
  const handleCalculateFare = async () => {
    if (selectedPickupLocation && selectedDestinationLocation) {
      try {
        const calculationOutcome = await calculateFare(
          selectedPickupLocation,
          selectedDestinationLocation
        );
        setCalculatedFareDetails(calculationOutcome);
      } catch (error) {
        console.error('Error during fare calculation:', error);
      }
    }
  };

  /**
   * Swaps start and destination values and triggers immediate asynchronous recalculation.
   * @async
   */
  const handleSwapLocations = async () => {
    const temporaryLocationHolder = selectedPickupLocation;
    setSelectedPickupLocation(selectedDestinationLocation);
    setSelectedDestinationLocation(temporaryLocationHolder);

    if (selectedDestinationLocation && temporaryLocationHolder) {
      try {
        const calculationOutcome = await calculateFare(
          selectedDestinationLocation,
          temporaryLocationHolder
        );
        setCalculatedFareDetails(calculationOutcome);
      } catch (error) {
        console.error('Error calculating fare after swap:', error);
      }
    }
  };

  /**
   * Delegates overcharge incident submission to the service layer.
   * @async
   * @param {Object} reportData - Incident metadata.
   * @returns {Promise<Object>}
   */
  const handleSubmitOverchargeReport = async (reportData) => {
    return await reportOvercharge(reportData);
  };

  return {
    selectedPickupLocation,
    setSelectedPickupLocation,
    selectedDestinationLocation,
    setSelectedDestinationLocation,
    calculatedFareDetails,
    activeFareChartList,
    isReportModalVisible,
    setIsReportModalVisible,
    handleCalculateFare,
    handleSwapLocations,
    handleSubmitOverchargeReport
  };
};