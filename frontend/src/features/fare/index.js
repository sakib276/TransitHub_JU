/**
 * @fileoverview Barrel file exporting the Fare feature module public interfaces.
 * @module features/fare
 * @author Nazmus Sakib
 * @version 1.0.0
 */

export { ViewFarePage } from './pages/ViewFarePage';
export { useFare } from './hooks/useFare';
export { fareService, CAMPUS_LOCATIONS_LIST, PREDEFINED_FARE_MATRIX } from './services/fareService';