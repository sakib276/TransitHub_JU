/**
 * @fileoverview Application composition root.
 */

import React from 'react';
import AvailableVehiclesFeature from './features/available-vehicles';

/**
 * Renders the current frontend feature under development.
 * @returns {React.JSX.Element} Application root.
 */
function App() {
  return <AvailableVehiclesFeature />;
}

export default App;
