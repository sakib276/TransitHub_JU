/**
 * @file Unit tests for the Complaint repository.
 *
 * Tests database persistence operations using a mocked database client.
 *
 * Repository responsibility:
 * - Execute SQL queries.
 * - Pass parameterized values to the database.
 * - Return database records.
 *
 * These tests do NOT require a real MySQL connection.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';

import { ComplaintRepository } from '../repositories/complaint-repository.js';

describe('ComplaintRepository', () => {
  let db;
  let repository;

  beforeEach(() => {
    /**
     * Mock database client.
     *
     * The real MySQL2 pool exposes execute().
     * Therefore the repository tests must mock execute(),
     * not query().
     */
    db = {
      execute: vi.fn(),
    };

    repository = new ComplaintRepository(db);
  });

  describe('create', () => {
    it('creates a complaint and returns the inserted database record', async () => {
      const complaintData = {
        complaint_id: 'CMP-2026-001',
        passenger_id: 'passenger-101',
        category: 'DRIVER',
        related_ride_id: 'RIDE-001',
        description: 'Driver took an unsafe route.',
        status: 'UNDER_REVIEW',
        admin_notes: null,
        reviewed_by: null,
        reviewed_at: null,
      };

      const createdRecord = {
        id: 1,
        ...complaintData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      /**
       * First database call:
       * INSERT INTO complaints
       */
      db.execute.mockResolvedValueOnce([
        {
          insertId: 1,
        },
      ]);

      /**
       * Second database call:
       * findById(1) -> SELECT ...
       */
      db.execute.mockResolvedValueOnce([[createdRecord]]);

      const result = await repository.create(complaintData);

      expect(db.execute).toHaveBeenCalledTimes(2);
      expect(result).toEqual(createdRecord);
    });
  });

  describe('findByComplaintId', () => {
    it('returns a complaint matching the public complaint ID', async () => {
      const record = {
        id: 1,
        complaint_id: 'CMP-2026-001',
        passenger_id: 'passenger-101',
        category: 'DRIVER',
        related_ride_id: 'RIDE-001',
        description: 'Driver complaint.',
        status: 'UNDER_REVIEW',
      };

      db.execute.mockResolvedValueOnce([[record]]);

      const result = await repository.findByComplaintId(
        'CMP-2026-001',
      );

      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(record);
    });

    it('returns null when complaint does not exist', async () => {
      db.execute.mockResolvedValueOnce([[]]);

      const result = await repository.findByComplaintId('CMP-999');

      expect(result).toBeNull();
    });
  });

  describe('findByPassengerId', () => {
    it('returns all complaints belonging to a passenger', async () => {
      const records = [
        {
          id: 1,
          complaint_id: 'CMP-2026-001',
          passenger_id: 'passenger-101',
          category: 'DRIVER',
          description: 'Driver complaint.',
          status: 'UNDER_REVIEW',
        },
        {
          id: 2,
          complaint_id: 'CMP-2026-002',
          passenger_id: 'passenger-101',
          category: 'SERVICE',
          description: 'Service complaint.',
          status: 'RESOLVED',
        },
      ];

      db.execute.mockResolvedValueOnce([records]);

      const result = await repository.findByPassengerId(
        'passenger-101',
      );

      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(records);
    });
  });

  describe('findAll', () => {
    it('returns all complaints', async () => {
      const records = [
        {
          id: 1,
          complaint_id: 'CMP-2026-001',
          passenger_id: 'passenger-101',
          category: 'DRIVER',
          description: 'Driver complaint.',
          status: 'UNDER_REVIEW',
        },
      ];

      db.execute.mockResolvedValueOnce([records]);

      const result = await repository.findAll();

      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(records);
    });
  });

  describe('updateStatus', () => {
    it('updates complaint status and returns the updated record', async () => {
      const updateData = {
        status: 'RESOLVED',
        admin_notes: 'Issue resolved.',
        reviewed_by: 'admin-001',
        reviewed_at: new Date(),
      };

      const updatedRecord = {
        id: 1,
        complaint_id: 'CMP-2026-001',
        passenger_id: 'passenger-101',
        category: 'DRIVER',
        description: 'Driver complaint.',
        status: 'RESOLVED',
        admin_notes: 'Issue resolved.',
        reviewed_by: 'admin-001',
        reviewed_at: updateData.reviewed_at,
      };

      /**
       * First call:
       * UPDATE complaints ...
       */
      db.execute.mockResolvedValueOnce([
        {
          affectedRows: 1,
        },
      ]);

      /**
       * Second call:
       * findByComplaintId()
       */
      db.execute.mockResolvedValueOnce([[updatedRecord]]);

      const result = await repository.updateStatus(
        'CMP-2026-001',
        updateData,
      );

      expect(db.execute).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedRecord);
    });

    it('throws an error when complaint does not exist', async () => {
      db.execute.mockResolvedValueOnce([
        {
          affectedRows: 0,
        },
      ]);

      await expect(
        repository.updateStatus('CMP-999', {
          status: 'RESOLVED',
          admin_notes: null,
          reviewed_by: 'admin-001',
          reviewed_at: new Date(),
        }),
      ).rejects.toThrow('Complaint not found.');

      expect(db.execute).toHaveBeenCalledTimes(1);
    });
  });
});