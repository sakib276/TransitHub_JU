/**
 * @file Unit tests for passenger and administrator complaint service business logic.
 *
 * Tests complaint creation with unique ID generation, passenger history retrieval,
 * single complaint access with ownership authorization, admin complaint listing,
 * and admin status transitions.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  COMPLAINT_CATEGORY,
  COMPLAINT_STATUS,
  USER_ROLES,
} from '../constants/complaint-constants.js';
import { ComplaintService } from '../services/complaint-service.js';

describe('ComplaintService', () => {
  let mockRepository;
  let service;

  const mockPassenger = {
    id: 'passenger-101',
    role: USER_ROLES.PASSENGER,
  };

  const mockOtherPassenger = {
    id: 'passenger-999',
    role: USER_ROLES.PASSENGER,
  };

  const mockAdmin = {
    id: 'admin-001',
    role: USER_ROLES.ADMIN,
  };

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findByComplaintId: vi.fn(),
      findByPassengerId: vi.fn(),
      findAll: vi.fn(),
      updateStatus: vi.fn(),
    };
    service = new ComplaintService(mockRepository);
  });

  describe('createComplaint', () => {
    /**
     * Verifies that a valid complaint is created with generated ID, status UNDER_REVIEW,
     * and associated passenger ID.
     */
    it('creates a complaint successfully for an authenticated passenger', async () => {
      const payload = {
        category: COMPLAINT_CATEGORY.DRIVER,
        relatedRideId: 'RIDE-001',
        description: 'Driver did not follow the assigned route.',
      };

      mockRepository.create.mockImplementation(async (record) => ({
        id: 1,
        ...record,
        created_at: new Date('2026-09-01T00:00:00Z'),
        updated_at: new Date('2026-09-01T00:00:00Z'),
      }));

      const result = await service.createComplaint(payload, mockPassenger);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      const passedRecord = mockRepository.create.mock.calls[0][0];

      expect(passedRecord.complaint_id).toMatch(/^CMP-/);
      expect(passedRecord.passenger_id).toBe(mockPassenger.id);
      expect(passedRecord.category).toBe(COMPLAINT_CATEGORY.DRIVER);
      expect(passedRecord.related_ride_id).toBe('RIDE-001');
      expect(passedRecord.description).toBe('Driver did not follow the assigned route.');
      expect(passedRecord.status).toBe(COMPLAINT_STATUS.UNDER_REVIEW);

      expect(result.complaintId).toMatch(/^CMP-/);
      expect(result.passengerId).toBe(mockPassenger.id);
      expect(result.status).toBe(COMPLAINT_STATUS.UNDER_REVIEW);
    });

    /**
     * Verifies that creating a general complaint without related ride succeeds.
     */
    it('creates a general complaint without related ride ID', async () => {
      const payload = {
        category: COMPLAINT_CATEGORY.SERVICE,
        description: 'General bus schedule delay.',
      };

      mockRepository.create.mockImplementation(async (record) => ({
        id: 2,
        ...record,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const result = await service.createComplaint(payload, mockPassenger);

      expect(result.category).toBe(COMPLAINT_CATEGORY.SERVICE);
      expect(result.relatedRideId).toBeNull();
    });

    /**
     * Verifies that invalid payload throws a 400 Bad Request error.
     */
    it('throws validation error with 400 statusCode when payload is invalid', async () => {
      const invalidPayload = {
        category: '',
        description: '',
      };

      await expect(
        service.createComplaint(invalidPayload, mockPassenger),
      ).rejects.toMatchObject({
        statusCode: 400,
        errors: {
          category: 'Complaint category is required.',
          description: 'Complaint description is required.',
        },
      });

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    /**
     * Verifies that missing user identity throws a 401 Unauthorized error.
     */
    it('throws 401 Unauthorized error when user identity is missing', async () => {
      const payload = {
        category: COMPLAINT_CATEGORY.DRIVER,
        description: 'Valid description.',
      };

      await expect(
        service.createComplaint(payload, null),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: 'Unauthorized: User identity is required.',
      });

      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getPassengerComplaints', () => {
    /**
     * Verifies that passenger retrieves their own complaints list.
     */
    it('retrieves complaints for the specified passenger', async () => {
      const mockRecords = [
        {
          id: 1,
          complaint_id: 'CMP-001',
          passenger_id: mockPassenger.id,
          category: COMPLAINT_CATEGORY.DRIVER,
          related_ride_id: 'RIDE-001',
          description: 'Driver route issue.',
          status: COMPLAINT_STATUS.UNDER_REVIEW,
          admin_notes: null,
          created_at: new Date(),
        },
      ];

      mockRepository.findByPassengerId.mockResolvedValue(mockRecords);

      const result = await service.getPassengerComplaints(mockPassenger.id);

      expect(mockRepository.findByPassengerId).toHaveBeenCalledWith(mockPassenger.id);
      expect(result).toHaveLength(1);
      expect(result[0].complaintId).toBe('CMP-001');
      expect(result[0].passengerId).toBe(mockPassenger.id);
    });

    /**
     * Verifies that an empty array is returned when the passenger has no complaints.
     */
    it('returns empty array when passenger has no submitted complaints', async () => {
      mockRepository.findByPassengerId.mockResolvedValue([]);

      const result = await service.getPassengerComplaints(mockPassenger.id);

      expect(result).toEqual([]);
    });

    /**
     * Verifies that missing passenger ID throws a 400 Bad Request error.
     */
    it('throws 400 Bad Request error when passenger ID is missing', async () => {
      await expect(
        service.getPassengerComplaints(null),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: 'Passenger ID is required.',
      });
    });
  });

  describe('getComplaintById', () => {
    const existingRecord = {
      id: 1,
      complaint_id: 'CMP-100',
      passenger_id: 'passenger-101',
      category: COMPLAINT_CATEGORY.DRIVER,
      related_ride_id: 'RIDE-001',
      description: 'Speeding vehicle.',
      status: COMPLAINT_STATUS.UNDER_REVIEW,
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    /**
     * Verifies that the complaint owner can retrieve their complaint.
     */
    it('allows the complaint owner to retrieve their complaint details', async () => {
      mockRepository.findByComplaintId.mockResolvedValue(existingRecord);

      const result = await service.getComplaintById('CMP-100', mockPassenger);

      expect(result.complaintId).toBe('CMP-100');
      expect(result.description).toBe('Speeding vehicle.');
    });

    /**
     * Verifies that an administrator can retrieve any complaint details.
     */
    it('allows an administrator to retrieve any complaint details', async () => {
      mockRepository.findByComplaintId.mockResolvedValue(existingRecord);

      const result = await service.getComplaintById('CMP-100', mockAdmin);

      expect(result.complaintId).toBe('CMP-100');
    });

    /**
     * Verifies that another passenger cannot access someone else's complaint (403 Forbidden).
     */
    it('throws 403 Forbidden when a passenger tries to access another passenger complaint', async () => {
      mockRepository.findByComplaintId.mockResolvedValue(existingRecord);

      await expect(
        service.getComplaintById('CMP-100', mockOtherPassenger),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: 'Forbidden: You do not have permission to view this complaint.',
      });
    });

    /**
     * Verifies that 404 Not Found is thrown when complaint does not exist.
     */
    it('throws 404 Not Found when complaint is not found', async () => {
      mockRepository.findByComplaintId.mockResolvedValue(null);

      await expect(
        service.getComplaintById('CMP-NONEXISTENT', mockPassenger),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: 'Complaint not found.',
      });
    });
  });

  describe('getAllComplaints (Admin)', () => {
    /**
     * Verifies that an administrator can retrieve all complaints.
     */
    it('allows an administrator to retrieve all complaints', async () => {
      const records = [
        {
          id: 1,
          complaint_id: 'CMP-001',
          passenger_id: 'passenger-101',
          category: COMPLAINT_CATEGORY.DRIVER,
          related_ride_id: null,
          description: 'Desc 1',
          status: COMPLAINT_STATUS.UNDER_REVIEW,
          admin_notes: null,
          created_at: new Date(),
        },
        {
          id: 2,
          complaint_id: 'CMP-002',
          passenger_id: 'passenger-102',
          category: COMPLAINT_CATEGORY.SERVICE,
          related_ride_id: null,
          description: 'Desc 2',
          status: COMPLAINT_STATUS.RESOLVED,
          admin_notes: 'Resolved issue',
          created_at: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(records);

      const result = await service.getAllComplaints(mockAdmin);

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].complaintId).toBe('CMP-001');
      expect(result[1].complaintId).toBe('CMP-002');
    });

    /**
     * Verifies that non-administrators cannot list all complaints (403 Forbidden).
     */
    it('throws 403 Forbidden when a passenger tries to retrieve all complaints', async () => {
      await expect(
        service.getAllComplaints(mockPassenger),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: 'Forbidden: Only administrators can view all complaints.',
      });

      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('updateComplaintStatus (Admin)', () => {
    const existingRecord = {
      id: 1,
      complaint_id: 'CMP-100',
      passenger_id: 'passenger-101',
      category: COMPLAINT_CATEGORY.DRIVER,
      related_ride_id: null,
      description: 'Driver issue.',
      status: COMPLAINT_STATUS.UNDER_REVIEW,
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    /**
     * Verifies that an admin can update complaint status to RESOLVED with notes.
     */
    it('updates complaint status to RESOLVED with admin notes', async () => {
      const updatePayload = {
        status: COMPLAINT_STATUS.RESOLVED,
        adminNotes: 'Driver spoke with supervisor and route compliance verified.',
      };

      mockRepository.findByComplaintId.mockResolvedValue(existingRecord);
      mockRepository.updateStatus.mockImplementation(async (_id, updates) => ({
        ...existingRecord,
        ...updates,
        updated_at: new Date(),
      }));

      const result = await service.updateComplaintStatus('CMP-100', updatePayload, mockAdmin);

      expect(mockRepository.updateStatus).toHaveBeenCalledTimes(1);
      const passedUpdates = mockRepository.updateStatus.mock.calls[0][1];

      expect(passedUpdates.status).toBe(COMPLAINT_STATUS.RESOLVED);
      expect(passedUpdates.admin_notes).toBe(
        'Driver spoke with supervisor and route compliance verified.',
      );
      expect(passedUpdates.reviewed_by).toBe(mockAdmin.id);
      expect(passedUpdates.reviewed_at).toBeInstanceOf(Date);

      expect(result.status).toBe(COMPLAINT_STATUS.RESOLVED);
      expect(result.adminNotes).toBe(
        'Driver spoke with supervisor and route compliance verified.',
      );
      expect(result.reviewedBy).toBe(mockAdmin.id);
    });

    /**
     * Verifies that an admin can update status to DISMISSED with notes.
     */
    it('updates complaint status to DISMISSED with admin notes', async () => {
      const updatePayload = {
        status: COMPLAINT_STATUS.DISMISSED,
        adminNotes: 'Insufficient evidence to verify complaint.',
      };

      mockRepository.findByComplaintId.mockResolvedValue(existingRecord);
      mockRepository.updateStatus.mockImplementation(async (_id, updates) => ({
        ...existingRecord,
        ...updates,
      }));

      const result = await service.updateComplaintStatus('CMP-100', updatePayload, mockAdmin);

      expect(result.status).toBe(COMPLAINT_STATUS.DISMISSED);
      expect(result.adminNotes).toBe('Insufficient evidence to verify complaint.');
    });

    /**
     * Verifies that non-admin users cannot update complaint status (403 Forbidden).
     */
    it('throws 403 Forbidden when a passenger tries to update complaint status', async () => {
      const updatePayload = {
        status: COMPLAINT_STATUS.RESOLVED,
      };

      await expect(
        service.updateComplaintStatus('CMP-100', updatePayload, mockPassenger),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: 'Forbidden: Only administrators can update complaint status.',
      });

      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });

    /**
     * Verifies that updating a non-existent complaint throws 404 Not Found.
     */
    it('throws 404 Not Found when updating status of non-existent complaint', async () => {
      const updatePayload = {
        status: COMPLAINT_STATUS.RESOLVED,
      };

      mockRepository.findByComplaintId.mockResolvedValue(null);

      await expect(
        service.updateComplaintStatus('CMP-NOTFOUND', updatePayload, mockAdmin),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: 'Complaint not found.',
      });

      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });

    /**
     * Verifies that invalid status update payload throws 400 Bad Request.
     */
    it('throws 400 Bad Request when status update payload is invalid', async () => {
      const invalidPayload = {
        status: 'INVALID_STATUS',
      };

      await expect(
        service.updateComplaintStatus('CMP-100', invalidPayload, mockAdmin),
      ).rejects.toMatchObject({
        statusCode: 400,
        errors: {
          status: 'Invalid complaint status. Must be UNDER_REVIEW, RESOLVED, or DISMISSED.',
        },
      });

      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });
  });
});

