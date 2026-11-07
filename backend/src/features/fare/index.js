/**
 * @fileoverview Barrel export for fare module.
 * @module features/fare
 * @author Nazmus Sakib
 */

import fareRoutes from './fareRoutes.js';
import fareController from './fareController.js';
import fareModel from './fareModel.js';

export {
  fareRoutes,
  fareController,
  fareModel
};

export default fareRoutes;