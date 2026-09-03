/**
 * @fileoverview System Oversight and Admin Reporting View (FR-6.4).
 * @module features/shared-ride/components/AdminSystemReportView
 * @author Nazmus Sakib
 */

import React from 'react';

export const AdminSystemReportView = ({ analytics }) => {
  if (!analytics) return <div>Loading system metrics...</div>;

  return (
    <div className="admin-system-view">
      <h2 className="sr-list-title">System Analytics & Quality Oversight (FR-6.4)</h2>
      <p className="sr-sub-title">Automated occupancy monitoring, cancellation auditing, and user complaints.</p>

      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-title">Total Rides Logged</span>
          <span className="metric-num">{analytics.totalRidesCount}</span>
        </div>
        <div className="metric-box">
          <span className="metric-title">Vehicle Seat Occupancy</span>
          <span className="metric-num highlight-green">{analytics.occupancyRate}</span>
        </div>
        <div className="metric-box">
          <span className="metric-title">Cancelled Rides</span>
          <span className="metric-num highlight-red">{analytics.cancelledCount}</span>
        </div>
        <div className="metric-box">
          <span className="metric-title">Total Reports / Complaints</span>
          <span className="metric-num">{analytics.complaints.length}</span>
        </div>
      </div>

      <div className="complaints-section" style={{ marginTop: '24px' }}>
        <h3 className="section-heading" style={{ fontSize: '15px', fontWeight: 600 }}>Passenger Ratings & Reported Issues</h3>
        {analytics.complaints.length === 0 ? (
          <div className="empty-state-card" style={{ marginTop: '10px' }}>No incidents or issues reported. All rides operational.</div>
        ) : (
          <table className="sr-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Driver</th>
                <th>Rating</th>
                <th>Category</th>
                <th>User Comments</th>
              </tr>
            </thead>
            <tbody>
              {analytics.complaints.map((c) => (
                <tr key={c.reportId}>
                  <td>{c.submittedAt}</td>
                  <td><strong>{c.driverName}</strong></td>
                  <td>{'⭐'.repeat(c.ratingScore)}</td>
                  <td><span className="category-tag">{c.issueCategory}</span></td>
                  <td>{c.commentText || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};