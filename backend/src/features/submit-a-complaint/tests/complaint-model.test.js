/**
 * @file Unit tests for the Complaint domain model entity.
 *
 * Tests domain model instantiation, database record mapping (snake_case),
 * public JSON serialization (camelCase), ownership verification,
 * and lifecycle status helpers.
 */

import { describe, expect, it } from 'vitest';
import {
  COMPLAINT_CATEGORY,
  COMPLAINT_STATUS,
} from '../constants/complaint-constants.js';
import { ComplaintModel } from '../models/complaint-model.js';

describe('ComplaintModel', () => {
  const sampleData = {
    id: 1,
    complaintId: 'CMP-2026-001',
    passengerId: 'passenger-101',
    category: COMPLAINT_CATEGORY.DRIVER,
    relatedRideId: 'RIDE-001',
    description: 'Driver took an unsafe route.',
    status: COMPLAINT_STATUS.UNDER_REVIEW,
    adminNotes: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  };

  describe('Instantiation', () => {
    /**
     * Verifies that a ComplaintModel instance is created with all attributes.
     */
    it('creates a ComplaintModel instance with provided properties', () => {
      const complaint = new ComplaintModel(sampleData);

      expect(complaint.id).toBe(1);
      expect(complaint.complaintId).toBe('CMP-2026-001');
      expect(complaint.passengerId).toBe('passenger-101');
      expect(complaint.category).toBe(COMPLAINT_CATEGORY.DRIVER);
      expect(complaint.relatedRideId).toBe('RIDE-001');
      expect(complaint.description).toBe('Driver took an unsafe route.');
      expect(complaint.status).toBe(COMPLAINT_STATUS.UNDER_REVIEW);
      expect(complaint.adminNotes).toBeNull();
      expect(complaint.reviewedBy).toBeNull();
      expect(complaint.reviewedAt).toBeNull();
    });

    /**
     * Verifies that default values are applied when optional properties are omitted.
     */
    it('applies default status UNDER_REVIEW when status is omitted', () => {
      const complaint = new ComplaintModel({
        complaintId: 'CMP-2026-002',
        passengerId: 'passenger-102',
        category: COMPLAINT_CATEGORY.SERVICE,
        description: 'Late arrival.',
      });

      expect(complaint.status).toBe(COMPLAINT_STATUS.UNDER_REVIEW);
      expect(complaint.relatedRideId).toBeNull();
      expect(complaint.adminNotes).toBeNull();
    });
  });

  describe('fromDatabaseRecord', () => {
    /**
     * Verifies that a database record in snake_case is converted into a ComplaintModel instance.
     */
    it('creates a ComplaintModel from a snake_case database row', () => {
      const dbRow = {
        id: 10,
        complaint_id: 'CMP-2026-010',
        passenger_id: 'passenger-200',
        category: 'SERVICE',
        related_ride_id: 'RIDE-999',
        description: 'AC was not working.',
        status: 'RESOLVED',
        admin_notes: 'Vehicle inspected and repaired.',
        reviewed_by: 'admin-001',
        reviewed_at: new Date('2026-09-01T01:00:00Z'),
        created_at: new Date('2026-09-01T00:00:00Z'),
        updated_at: new Date('2026-09-01T01:00:00Z'),
      };

      const complaint = ComplaintModel.fromDatabaseRecord(dbRow);

      expect(complaint).toBeInstanceOf(ComplaintModel);
      expect(complaint.id).toBe(10);
      expect(complaint.complaintId).toBe('CMP-2026-010');
      expect(complaint.passengerId).toBe('passenger-200');
      expect(complaint.category).toBe(COMPLAINT_CATEGORY.SERVICE);
      expect(complaint.relatedRideId).toBe('RIDE-999');
      expect(complaint.status).toBe(COMPLAINT_STATUS.RESOLVED);
      expect(complaint.adminNotes).toBe('Vehicle inspected and repaired.');
      expect(complaint.reviewedBy).toBe('admin-001');
    });

    /**
     * Verifies that null is returned when database row is null or undefined.
     */
    it('returns null when input database row is null or undefined', () => {
      expect(ComplaintModel.fromDatabaseRecord(null)).toBeNull();
      expect(ComplaintModel.fromDatabaseRecord(undefined)).toBeNull();
    });
  });

  describe('toDatabaseRecord', () => {
    /**
     * Verifies that a ComplaintModel instance converts to a snake_case database object.
     */
    it('converts a ComplaintModel to a snake_case database record', () => {
      const complaint = new ComplaintModel(sampleData);
      const dbRecord = complaint.toDatabaseRecord();

      expect(dbRecord).toEqual({
        complaint_id: 'CMP-2026-001',
        passenger_id: 'passenger-101',
        category: COMPLAINT_CATEGORY.DRIVER,
        related_ride_id: 'RIDE-001',
        description: 'Driver took an unsafe route.',
        status: COMPLAINT_STATUS.UNDER_REVIEW,
        admin_notes: null,
        reviewed_by: null,
        reviewed_at: null,
      });
    });
  });

  describe('toPublicJSON', () => {
    /**
     * Verifies that the public API JSON format is generated correctly.
     */
    it('serializes to public camelCase JSON representation', () => {
      const complaint = new ComplaintModel(sampleData);
      const json = complaint.toPublicJSON();

      expect(json).toEqual({
        id: 1,
        complaintId: 'CMP-2026-001',
        passengerId: 'passenger-101',
        category: COMPLAINT_CATEGORY.DRIVER,
        relatedRideId: 'RIDE-001',
        description: 'Driver took an unsafe route.',
        status: COMPLAINT_STATUS.UNDER_REVIEW,
        adminNotes: null,
        reviewedBy: null,
        reviewedAt: null,
        createdAt: sampleData.createdAt,
        updatedAt: sampleData.updatedAt,
      });
    });
  });

  describe('Ownership & Status Helpers', () => {
    /**
     * Verifies isOwnedBy correctly identifies passenger ownership.
     */
    it('returns true when passenger ID matches owner, false otherwise', () => {
      const complaint = new ComplaintModel(sampleData);

      expect(complaint.isOwnedBy('passenger-101')).toBe(true);
      expect(complaint.isOwnedBy('passenger-999')).toBe(false);
      expect(complaint.isOwnedBy(null)).toBe(false);
    });

    /**
     * Verifies status helper methods.
     */
    it('identifies lifecycle status correctly', () => {
      const complaint = new ComplaintModel({
        ...sampleData,
        status: COMPLAINT_STATUS.UNDER_REVIEW,
      });

      expect(complaint.isUnderReview()).toBe(true);
      expect(complaint.isResolved()).toBe(false);
      expect(complaint.isDismissed()).toBe(false);
    });
  });
});
