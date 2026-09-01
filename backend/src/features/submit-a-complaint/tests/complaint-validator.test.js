/**
 * @file Unit tests for passenger and administrator complaint validation logic.
 *
 * Tests validation of complaint creation payloads (category, description,
 * optional related ride ID) and administrator status update payloads
 * (status, admin review notes).
 */

import { describe, expect, it } from 'vitest';
import {
  COMPLAINT_CATEGORY,
  COMPLAINT_STATUS,
} from '../complaint-constants.js';
import {
  validateCreateComplaint,
  validateUpdateComplaintStatus,
} from '../complaint-validator.js';

/**
 * Test suite for complaint creation validation.
 */
describe('Complaint Validator - Create Complaint', () => {
  /**
   * Verifies that a valid complaint payload with a related ride ID passes validation.
   */
  it('accepts a valid complaint payload with a related ride ID', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.DRIVER,
      relatedRideId: 'RIDE-001',
      description: 'The driver did not follow the route.',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data).toEqual({
      category: COMPLAINT_CATEGORY.DRIVER,
      relatedRideId: 'RIDE-001',
      description: 'The driver did not follow the route.',
    });
  });

  /**
   * Verifies that a valid general complaint without a related ride ID passes validation.
   */
  it('accepts a valid general complaint without a related ride ID', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.SERVICE,
      description: 'The service is frequently delayed.',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data).toEqual({
      category: COMPLAINT_CATEGORY.SERVICE,
      relatedRideId: null,
      description: 'The service is frequently delayed.',
    });
  });

  /**
   * Verifies that relatedRide is accepted as an alias for relatedRideId.
   */
  it('accepts relatedRide as an alias for relatedRideId', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.RIDE,
      relatedRide: 'RIDE-002',
      description: 'Vehicle air conditioning was not functioning.',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data.relatedRideId).toBe('RIDE-002');
  });

  /**
   * Verifies that validation fails when the category field is missing.
   */
  it('rejects when category is missing', () => {
    const payload = {
      description: 'The driver arrived late.',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.category).toBe('Complaint category is required.');
  });

  /**
   * Verifies that validation fails when an unsupported category value is provided.
   */
  it('rejects when category is invalid', () => {
    const payload = {
      category: 'INVALID_CATEGORY',
      description: 'The driver arrived late.',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.category).toBe(
      'Invalid complaint category. Must be DRIVER, SERVICE, or RIDE.',
    );
  });

  /**
   * Verifies that validation fails when the category is not a string.
   */
  it('rejects when category is not a string', () => {
    const payload = {
      category: 123,
      description: 'The driver arrived late.',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.category).toBe(
      'Invalid complaint category. Must be DRIVER, SERVICE, or RIDE.',
    );
  });

  /**
   * Verifies that validation fails when the description field is omitted.
   */
  it('rejects when description is missing', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.DRIVER,
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('Complaint description is required.');
  });

  /**
   * Verifies that validation fails when the description contains only whitespace.
   */
  it('rejects when description is empty or contains only whitespace', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.DRIVER,
      description: '     ',
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('Complaint description is required.');
  });

  /**
   * Verifies that validation fails when the description is not a string.
   */
  it('rejects when description is not a string', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.DRIVER,
      description: { text: 'Some text' },
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('Complaint description is required.');
  });

  /**
   * Verifies that validation fails when the related ride ID is not a string.
   */
  it('rejects when relatedRideId is not a string', () => {
    const payload = {
      category: COMPLAINT_CATEGORY.DRIVER,
      description: 'The driver was reckless.',
      relatedRideId: 12345,
    };

    const result = validateCreateComplaint(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.relatedRideId).toBe('Related ride ID must be a string.');
  });

  /**
   * Verifies that validation fails gracefully when no payload is provided.
   */
  it('rejects when payload is undefined or null', () => {
    const result = validateCreateComplaint();

    expect(result.isValid).toBe(false);
    expect(result.errors.category).toBe('Complaint category is required.');
    expect(result.errors.description).toBe('Complaint description is required.');
  });
});

/**
 * Test suite for complaint status update validation.
 */
describe('Complaint Validator - Update Complaint Status', () => {
  /**
   * Verifies that updating status to RESOLVED with admin notes is valid.
   */
  it('accepts a valid status update to RESOLVED with admin notes', () => {
    const payload = {
      status: COMPLAINT_STATUS.RESOLVED,
      adminNotes: 'Driver route training conducted.',
    };

    const result = validateUpdateComplaintStatus(payload);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data).toEqual({
      status: COMPLAINT_STATUS.RESOLVED,
      adminNotes: 'Driver route training conducted.',
    });
  });

  /**
   * Verifies that updating status to DISMISSED with admin notes is valid.
   */
  it('accepts a valid status update to DISMISSED with admin notes', () => {
    const payload = {
      status: COMPLAINT_STATUS.DISMISSED,
      adminNotes: 'Insufficient details provided after investigation.',
    };

    const result = validateUpdateComplaintStatus(payload);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data.status).toBe(COMPLAINT_STATUS.DISMISSED);
  });

  /**
   * Verifies that updating status to UNDER_REVIEW without admin notes is valid.
   */
  it('accepts a valid status update to UNDER_REVIEW without admin notes', () => {
    const payload = {
      status: COMPLAINT_STATUS.UNDER_REVIEW,
    };

    const result = validateUpdateComplaintStatus(payload);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data).toEqual({
      status: COMPLAINT_STATUS.UNDER_REVIEW,
      adminNotes: null,
    });
  });

  /**
   * Verifies that status update fails when the status field is missing.
   */
  it('rejects when status is missing', () => {
    const payload = {
      adminNotes: 'Some notes',
    };

    const result = validateUpdateComplaintStatus(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.status).toBe('Complaint status is required.');
  });

  /**
   * Verifies that status update fails when an invalid status enum is provided.
   */
  it('rejects when status is invalid', () => {
    const payload = {
      status: 'PENDING_APPROVAL',
    };

    const result = validateUpdateComplaintStatus(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.status).toBe(
      'Invalid complaint status. Must be UNDER_REVIEW, RESOLVED, or DISMISSED.',
    );
  });

  /**
   * Verifies that status update fails when admin notes is not a string.
   */
  it('rejects when adminNotes is not a string', () => {
    const payload = {
      status: COMPLAINT_STATUS.RESOLVED,
      adminNotes: 12345,
    };

    const result = validateUpdateComplaintStatus(payload);

    expect(result.isValid).toBe(false);
    expect(result.errors.adminNotes).toBe('Admin notes must be a string.');
  });

  /**
   * Verifies that status update fails gracefully when no payload is provided.
   */
  it('rejects when payload is undefined or null', () => {
    const result = validateUpdateComplaintStatus();

    expect(result.isValid).toBe(false);
    expect(result.errors.status).toBe('Complaint status is required.');
  });
});
