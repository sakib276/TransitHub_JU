/**
 * @file Business logic service for passenger complaints and administrator review actions.
 *
 * Implements complaint creation, status transitions, retrieval of passenger history,
 * single complaint retrieval with ownership verification, and administrator review actions.
 *
 * This module is independent of Express request/response objects, database drivers,
 * and authentication token decoding/generation.
 */

import {
  COMPLAINT_STATUS,
  USER_ROLES,
} from '../constants/complaint-constants.js';
import {
  validateCreateComplaint,
  validateUpdateComplaintStatus,
} from '../validators/complaint-validator.js';

/**
 * Service class handling complaint domain operations.
 */
export class ComplaintService {
  /**
   * Initializes the complaint service with a repository dependency.
   *
   * @param {Object} repository - The complaint repository instance.
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Generates a unique, collision-resistant public complaint identifier.
   *
   * @returns {string} Unique complaint ID (e.g. CMP-1725150000000-4821).
   */
  generateComplaintId() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CMP-${timestamp}-${randomSuffix}`;
  }

  /**
   * Maps a database record (snake_case) to a clean domain object (camelCase).
   *
   * @param {Object} record - Database record.
   * @returns {Object} Mapped domain object.
   * @private
   */
  #mapToDomain(record) {
    if (!record) return null;

    return {
      id: record.id,
      complaintId: record.complaint_id,
      passengerId: record.passenger_id,
      category: record.category,
      relatedRideId: record.related_ride_id ?? null,
      description: record.description,
      status: record.status,
      adminNotes: record.admin_notes ?? null,
      reviewedBy: record.reviewed_by ?? null,
      reviewedAt: record.reviewed_at ?? null,
      createdAt: record.created_at ?? null,
      updatedAt: record.updated_at ?? null,
    };
  }

  /**
   * Creates a new complaint for an authenticated passenger.
   *
   * @param {Object} payload - The complaint creation data.
   * @param {Object} currentUser - The authenticated user identity.
   * @param {string} currentUser.id - The passenger user ID.
   * @param {string} currentUser.role - The user role.
   * @returns {Promise<Object>} The created complaint domain object.
   * @throws {Object} Validation error (400) or Unauthorized error (401).
   */
  async createComplaint(payload, currentUser) {
    if (!currentUser || !currentUser.id) {
      const error = new Error('Unauthorized: User identity is required.');
      error.statusCode = 401;
      throw error;
    }

    const validationResult = validateCreateComplaint(payload);

    if (!validationResult.isValid) {
      const error = new Error('Validation failed.');
      error.statusCode = 400;
      error.errors = validationResult.errors;
      throw error;
    }

    const complaintId = this.generateComplaintId();

    const recordToCreate = {
      complaint_id: complaintId,
      passenger_id: currentUser.id,
      category: validationResult.data.category,
      related_ride_id: validationResult.data.relatedRideId,
      description: validationResult.data.description,
      status: COMPLAINT_STATUS.UNDER_REVIEW,
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
    };

    const createdRecord = await this.repository.create(recordToCreate);

    return this.#mapToDomain(createdRecord);
  }

  /**
   * Retrieves all complaints submitted by a specific passenger.
   *
   * @param {string} passengerId - The passenger user ID.
   * @returns {Promise<Array<Object>>} Array of passenger complaints.
   * @throws {Object} Bad request error (400).
   */
  async getPassengerComplaints(passengerId) {
    if (!passengerId) {
      const error = new Error('Passenger ID is required.');
      error.statusCode = 400;
      throw error;
    }

    const records = await this.repository.findByPassengerId(passengerId);

    return (records || []).map((record) => this.#mapToDomain(record));
  }

  /**
   * Retrieves a specific complaint by its public complaint ID.
   * Enforces data ownership checks (passengers can only view their own complaints;
   * admins can view any complaint).
   *
   * @param {string} complaintId - Public complaint ID.
   * @param {Object} currentUser - Authenticated user identity.
   * @returns {Promise<Object>} The complaint domain object.
   * @throws {Object} Not found (404) or Forbidden (403) error.
   */
  async getComplaintById(complaintId, currentUser) {
    const record = await this.repository.findByComplaintId(complaintId);

    if (!record) {
      const error = new Error('Complaint not found.');
      error.statusCode = 404;
      throw error;
    }

    if (
      currentUser?.role !== USER_ROLES.ADMIN &&
      record.passenger_id !== currentUser?.id
    ) {
      const error = new Error(
        'Forbidden: You do not have permission to view this complaint.',
      );
      error.statusCode = 403;
      throw error;
    }

    return this.#mapToDomain(record);
  }

  /**
   * Retrieves all complaints across the system (administrator action).
   *
   * @param {Object} currentUser - Authenticated user identity.
   * @returns {Promise<Array<Object>>} Array of all complaint objects.
   * @throws {Object} Forbidden error (403) if caller is not an admin.
   */
  async getAllComplaints(currentUser) {
    if (!currentUser || currentUser.role !== USER_ROLES.ADMIN) {
      const error = new Error(
        'Forbidden: Only administrators can view all complaints.',
      );
      error.statusCode = 403;
      throw error;
    }

    const records = await this.repository.findAll();

    return (records || []).map((record) => this.#mapToDomain(record));
  }

  /**
   * Updates the lifecycle status of a complaint and records admin review notes.
   *
   * @param {string} complaintId - Public complaint ID.
   * @param {Object} payload - Status update data.
   * @param {string} payload.status - New complaint status.
   * @param {string} [payload.adminNotes] - Optional admin review notes.
   * @param {Object} currentUser - Authenticated user identity (must be admin).
   * @returns {Promise<Object>} The updated complaint domain object.
   * @throws {Object} Forbidden (403), Validation (400), or Not found (404) error.
   */
  async updateComplaintStatus(complaintId, payload, currentUser) {
    if (!currentUser || currentUser.role !== USER_ROLES.ADMIN) {
      const error = new Error(
        'Forbidden: Only administrators can update complaint status.',
      );
      error.statusCode = 403;
      throw error;
    }

    const validationResult = validateUpdateComplaintStatus(payload);

    if (!validationResult.isValid) {
      const error = new Error('Validation failed.');
      error.statusCode = 400;
      error.errors = validationResult.errors;
      throw error;
    }

    const existingRecord = await this.repository.findByComplaintId(complaintId);

    if (!existingRecord) {
      const error = new Error('Complaint not found.');
      error.statusCode = 404;
      throw error;
    }

    const updateData = {
      status: validationResult.data.status,
      admin_notes: validationResult.data.adminNotes,
      reviewed_by: currentUser.id,
      reviewed_at: new Date(),
    };

    const updatedRecord = await this.repository.updateStatus(
      complaintId,
      updateData,
    );

    return this.#mapToDomain(updatedRecord);
  }
}

