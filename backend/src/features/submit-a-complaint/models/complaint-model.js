/**
 * @file Domain model for complaints.
 *
 * Represents a complaint within the submit-a-complaint feature and provides
 * mappings between database records, domain objects, and public API JSON.
 */

import {
  COMPLAINT_STATUS,
} from '../constants/complaint-constants.js';

/**
 * Complaint domain model.
 */
export class ComplaintModel {
  /**
   * Creates a ComplaintModel instance.
   *
   * @param {Object} data - Complaint data.
   * @param {number|null} [data.id=null] - Database ID.
   * @param {string} data.complaintId - Public complaint identifier.
   * @param {string} data.passengerId - Passenger user ID.
   * @param {string} data.category - Complaint category.
   * @param {string|null} [data.relatedRideId=null] - Related ride ID.
   * @param {string} data.description - Complaint description.
   * @param {string} [data.status=COMPLAINT_STATUS.UNDER_REVIEW] - Complaint status.
   * @param {string|null} [data.adminNotes=null] - Administrator notes.
   * @param {string|null} [data.reviewedBy=null] - Admin user ID.
   * @param {Date|null} [data.reviewedAt=null] - Review timestamp.
   * @param {Date|null} [data.createdAt=null] - Creation timestamp.
   * @param {Date|null} [data.updatedAt=null] - Last update timestamp.
   */
  constructor({
    id = null,
    complaintId,
    passengerId,
    category,
    relatedRideId = null,
    description,
    status = COMPLAINT_STATUS.UNDER_REVIEW,
    adminNotes = null,
    reviewedBy = null,
    reviewedAt = null,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.complaintId = complaintId;
    this.passengerId = passengerId;
    this.category = category;
    this.relatedRideId = relatedRideId;
    this.description = description;
    this.status = status;
    this.adminNotes = adminNotes;
    this.reviewedBy = reviewedBy;
    this.reviewedAt = reviewedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates a ComplaintModel from a database record.
   *
   * @param {Object|null|undefined} row - Snake_case database row.
   * @returns {ComplaintModel|null} Complaint model or null.
   */
  static fromDatabaseRecord(row) {
    if (!row) {
      return null;
    }

    return new ComplaintModel({
      id: row.id,
      complaintId: row.complaint_id,
      passengerId: row.passenger_id,
      category: row.category,
      relatedRideId: row.related_ride_id ?? null,
      description: row.description,
      status: row.status,
      adminNotes: row.admin_notes ?? null,
      reviewedBy: row.reviewed_by ?? null,
      reviewedAt: row.reviewed_at ?? null,
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
    });
  }

  /**
   * Converts the model into a database-compatible snake_case record.
   *
   * @returns {Object} Database record.
   */
  toDatabaseRecord() {
    return {
      complaint_id: this.complaintId,
      passenger_id: this.passengerId,
      category: this.category,
      related_ride_id: this.relatedRideId,
      description: this.description,
      status: this.status,
      admin_notes: this.adminNotes,
      reviewed_by: this.reviewedBy,
      reviewed_at: this.reviewedAt,
    };
  }

  /**
   * Converts the model into a public API JSON representation.
   *
   * @returns {Object} Public complaint representation.
   */
  toPublicJSON() {
    return {
      id: this.id,
      complaintId: this.complaintId,
      passengerId: this.passengerId,
      category: this.category,
      relatedRideId: this.relatedRideId,
      description: this.description,
      status: this.status,
      adminNotes: this.adminNotes,
      reviewedBy: this.reviewedBy,
      reviewedAt: this.reviewedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Checks whether the complaint belongs to a passenger.
   *
   * @param {string|null} passengerId - Passenger ID to verify.
   * @returns {boolean} True when the passenger owns the complaint.
   */
  isOwnedBy(passengerId) {
    return Boolean(passengerId) && this.passengerId === passengerId;
  }

  /**
   * Checks whether the complaint is under review.
   *
   * @returns {boolean} True if status is UNDER_REVIEW.
   */
  isUnderReview() {
    return this.status === COMPLAINT_STATUS.UNDER_REVIEW;
  }

  /**
   * Checks whether the complaint is resolved.
   *
   * @returns {boolean} True if status is RESOLVED.
   */
  isResolved() {
    return this.status === COMPLAINT_STATUS.RESOLVED;
  }

  /**
   * Checks whether the complaint is dismissed.
   *
   * @returns {boolean} True if status is DISMISSED.
   */
  isDismissed() {
    return this.status === COMPLAINT_STATUS.DISMISSED;
  }
}