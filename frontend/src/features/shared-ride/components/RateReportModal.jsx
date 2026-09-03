/**
 * @fileoverview Feedback and incident reporting modal for shared rides (FR-6.1.7).
 * @module features/shared-ride/components/RateReportModal
 * @author Nazmus Sakib
 */

import React, { useState } from 'react';

export const RateReportModal = ({ isModalOpen, selectedRide, onCloseModal, onSubmitReview }) => {
  const [ratingScore, setRatingScore] = useState(5);
  const [issueCategory, setIssueCategory] = useState('None');
  const [commentText, setCommentText] = useState('');

  if (!isModalOpen || !selectedRide) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({
      rideId: selectedRide.id,
      driverName: selectedRide.driverName,
      ratingScore: Number(ratingScore),
      issueCategory,
      commentText
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-card">
        <div className="modal-header">
          <h3>Rate Trip / Report Issue</h3>
          <button type="button" className="btn-close-x" onClick={onCloseModal}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="rating-select">Rating (1 to 5 Stars)</label>
            <select
              id="rating-select"
              value={ratingScore}
              onChange={(e) => setRatingScore(e.target.value)}
            >
              <option value="5">⭐⭐⭐⭐⭐ - Excellent Service</option>
              <option value="4">⭐⭐⭐⭐ - Good</option>
              <option value="3">⭐⭐⭐ - Average</option>
              <option value="2">⭐⭐ - Poor</option>
              <option value="1">⭐ - Very Bad</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issue-category-select">Report Issue (Optional)</label>
            <select
              id="issue-category-select"
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
            >
              <option value="None">No Issues (Smooth Ride)</option>
              <option value="Overcharged">Overcharged Fare</option>
              <option value="Reckless Driving">Reckless Driving</option>
              <option value="Misbehavior">Unprofessional Behavior</option>
              <option value="Delayed Departure">Excessive Delay</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comment-textarea">Comments & Experience</label>
            <textarea
              id="comment-textarea"
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Provide constructive feedback for service quality..."
            />
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-cancel-flat" onClick={onCloseModal}>Cancel</button>
            <button type="submit" className="btn-primary-action">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
};