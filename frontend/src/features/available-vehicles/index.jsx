/**
 * @fileoverview Feature entry point for passenger vehicle availability.
 * @module features/available-vehicles
 */

import React from 'react';
import { useAvailableVehiclesController } from './controllers/useAvailableVehiclesController';
import { AvailableVehiclesView } from './views/AvailableVehiclesView';
import './styles/availableVehicles.css';

/**
 * Connects the Available Vehicles view to its MVC controller.
 * @returns {React.JSX.Element} Available Vehicles feature.
 */
const AvailableVehiclesFeature = () => {
  const controller = useAvailableVehiclesController();
  return <AvailableVehiclesView {...controller} />;
};

export { AvailableVehiclesFeature };
export default AvailableVehiclesFeature;
