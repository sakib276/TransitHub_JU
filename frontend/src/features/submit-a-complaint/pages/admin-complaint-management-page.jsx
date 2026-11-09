import React, { useEffect, useState } from 'react';
import {
  getAllComplaints,
  updateComplaintStatus,
} from '../services/complaint-service.js';
import '../styles/complaint.css';

/**
 * Admin view to monitor, review, and resolve submitted complaints.
 */
export default function AdminComplaintManagementPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenReview = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status === 'UNDER_REVIEW' ? 'RESOLVED' : complaint.status);
    setAdminNotes(complaint.adminNotes || '');
    setActionError(null);
    setActionSuccess(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setUpdating(true);
      setActionError(null);
      setActionSuccess(null);

      const updated = await updateComplaintStatus(selectedComplaint.complaintId, {
        status: newStatus,
        adminNotes,
      });

      setActionSuccess(`Complaint ${updated.complaintId} updated successfully.`);
      
      // Update item in local list
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaintId === updated.complaintId ? { ...c, ...updated } : c
        )
      );
      setSelectedComplaint((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setActionError(err.message || 'Failed to update complaint.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'complaint-badge--resolved';
      case 'DISMISSED':
        return 'complaint-badge--dismissed';
      case 'UNDER_REVIEW':
      default:
        return 'complaint-badge--review';
    }
  };

  return (
    <main className="complaint-page">
      <header className="complaint-page__header">
        <h1>Admin Complaint Management</h1>
        <p>Review, resolve, or dismiss submitted complaints across the transport system.</p>
      </header>

      <div className="complaint-card" style={{ maxWidth: '1050px', margin: '0 auto 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>All Complaints ({complaints.length})</h2>
          <button
            type="button"
            className="complaint-button"
            style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}
            onClick={fetchComplaints}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        {error && (
          <div className="complaint-feedback complaint-feedback--error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6b7a90' }}>
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6b7a90' }}>
            No complaints found in the system.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e1e7f0', color: '#4a5b78' }}>
                  <th style={{ padding: '12px 8px' }}>Complaint ID</th>
                  <th style={{ padding: '12px 8px' }}>Category</th>
                  <th style={{ padding: '12px 8px' }}>Ride ID</th>
                  <th style={{ padding: '12px 8px' }}>Description</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item) => (
                  <tr key={item.complaintId} style={{ borderBottom: '1px solid #f0f3f7' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '600' }}>{item.complaintId}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className="complaint-category-tag">{item.category}</span>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#6b7a90' }}>
                      {item.relatedRideId || '—'}
                    </td>
                    <td style={{ padding: '12px 8px', maxWidth: '300px', wordBreak: 'break-word' }}>
                      {item.description}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className={`complaint-status-badge ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <button
                        type="button"
                        style={{
                          background: '#0d6efd',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                        onClick={() => handleOpenReview(item)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal / Drawer */}
      {selectedComplaint && (
        <div className="complaint-card" style={{ maxWidth: '1050px', margin: '0 auto', border: '2px solid #0d6efd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>
              Reviewing Complaint: {selectedComplaint.complaintId}
            </h3>
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7a90' }}
              onClick={() => setSelectedComplaint(null)}
            >
              ✕
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            <p style={{ margin: '0 0 6px' }}><strong>Category:</strong> {selectedComplaint.category}</p>
            <p style={{ margin: '0 0 6px' }}><strong>Passenger ID:</strong> {selectedComplaint.passengerId}</p>
            <p style={{ margin: '0 0 6px' }}><strong>Related Ride:</strong> {selectedComplaint.relatedRideId || 'None'}</p>
            <p style={{ margin: '0 0 6px' }}><strong>Description:</strong> {selectedComplaint.description}</p>
            {selectedComplaint.reviewedBy && (
              <p style={{ margin: '0', color: '#4a5b78' }}>
                <em>Previously reviewed by {selectedComplaint.reviewedBy} at {new Date(selectedComplaint.reviewedAt).toLocaleString()}</em>
              </p>
            )}
          </div>

          {actionSuccess && (
            <div className="complaint-feedback complaint-feedback--success" style={{ marginBottom: '14px' }}>
              {actionSuccess}
            </div>
          )}

          {actionError && (
            <div className="complaint-feedback complaint-feedback--error" style={{ marginBottom: '14px' }}>
              {actionError}
            </div>
          )}

          <form onSubmit={handleUpdateStatus}>
            <div style={{ marginBottom: '14px' }}>
              <label htmlFor="admin-status-select" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
                Update Status
              </label>
              <select
                id="admin-status-select"
                className="complaint-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="DISMISSED">DISMISSED</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="admin-notes-textarea" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
                Admin Notes
              </label>
              <textarea
                id="admin-notes-textarea"
                className="complaint-textarea"
                rows="3"
                placeholder="Enter actions taken or justification for status change..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="complaint-button"
                style={{ width: 'auto', padding: '10px 24px' }}
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Review'}
              </button>
              <button
                type="button"
                style={{
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
                onClick={() => setSelectedComplaint(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
