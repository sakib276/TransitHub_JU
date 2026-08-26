/**
 * @fileoverview Table component rendering the complete fixed campus fare directory.
 * @module features/fare/components/FareChartTable
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import React from 'react';

/**
 * Predefined campus fare matrix table view.
 * @param {Object} props - Component properties.
 * @param {Array<{id: number, from: string, to: string, rickshawFare: number, cartFare: number}>} props.activeFareChartList - List of all route rates.
 * @returns {JSX.Element} Rendered table view.
 */
export const FareChartTable = ({ activeFareChartList }) => {
  return (
    <div className="table-card-container">
      <table className="table-styled">
        <thead>
          <tr>
            <th className="align-left">START POINT</th>
            <th className="align-left">DESTINATION</th>
            <th className="align-right">🚲 RICKSHAW FARE</th>
            <th className="align-right">🚐 CART FARE</th>
          </tr>
        </thead>
        <tbody>
          {activeFareChartList.map((routeRecord) => (
            <tr key={routeRecord.id || `${routeRecord.from}-${routeRecord.to}`}>
              <td className="align-left td-place-bold">{routeRecord.from}</td>
              <td className="align-left">{routeRecord.to}</td>
              <td className="align-right td-fare-amount">৳ {routeRecord.rickshawFare}</td>
              <td className="align-right td-fare-amount">৳ {routeRecord.cartFare}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};