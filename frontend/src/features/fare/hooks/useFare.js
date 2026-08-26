/**
 * @fileoverview Custom React hook managing fare selection state, calculations, and modal visibility.
 * @module features/fare/hooks/useFare
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { fareService } from '../services/fareService';

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

  useEffect(() => {
    const loadFareMatrix = async () => {
      const response = await fareService.getFareChart();
      if (response.isSuccessful) {
        setActiveFareChartList(response.fareChartData);
      }
    };

    loadFareMatrix();
  }, []);

  /**
   * Triggers fare comparison evaluation based on active user selection.
   */
  const handleCalculateFare = () => {
    if (selectedPickupLocation && selectedDestinationLocation) {
      const calculationOutcome = fareService.calculateFare(
        selectedPickupLocation,
        selectedDestinationLocation,
        activeFareChartList
      );
      setCalculatedFareDetails(calculationOutcome);
    }
  };

  /**
   * Swaps start and destination values and triggers immediate recalculation.
   */
  const handleSwapLocations = () => {
    const temporaryLocationHolder = selectedPickupLocation;
    setSelectedPickupLocation(selectedDestinationLocation);
    setSelectedDestinationLocation(temporaryLocationHolder);

    if (selectedDestinationLocation && temporaryLocationHolder) {
      const calculationOutcome = fareService.calculateFare(
        selectedDestinationLocation,
        temporaryLocationHolder,
        activeFareChartList
      );
      setCalculatedFareDetails(calculationOutcome);
    }
  };

  /**
   * Delegates overcharge incident submission to service layer.
   * @param {Object} reportData - Incident metadata.
   * @returns {Promise<Object>}
   */
  const handleSubmitOverchargeReport = async (reportData) => {
    return await fareService.reportOvercharge(reportData);
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