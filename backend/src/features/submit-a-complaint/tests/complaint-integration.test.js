import { describe, expect, it } from 'vitest';
import request from 'supertest';

import { createApp } from '../../../app.js';

describe('Submit a Complaint - Integration', () => {
  /**
   * Mock database used for integration testing.
   *
   * This avoids requiring a real database connection.
   */
 const mockDb = {
  async execute(sql) {
    if (sql.includes('INSERT INTO complaints')) {
      return [
        {
          insertId: 1,
        },
        [],
      ];
    }

    if (sql.includes('FROM complaints')) {
      return [
        [
          {
            id: 1,
            complaint_id: 'CMP-TEST-001',
            passenger_id: 'PASSENGER-001',
            category: 'SERVICE',
            related_ride_id: 'RIDE-001',
            description: 'The bus service was delayed.',
            status: 'UNDER_REVIEW',
            admin_notes: null,
            reviewed_by: null,
            reviewed_at: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        [],
      ];
    }

    throw new Error(`Unexpected SQL query: ${sql}`);
  },
};
     

  /**
   * Create the Express application with the mock database.
   */
  const app = createApp({
    db: mockDb,
  });

  describe('POST /api/complaints', () => {
    it('should create a complaint and return HTTP 201', async () => {
      const complaintData = {
        category: 'SERVICE',
        description: 'The bus service was delayed.',
        relatedRideId: 'RIDE-001',
      };

      const response = await request(app)
        .post('/api/complaints')
        .send(complaintData);


      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.category).toBe('SERVICE');
      expect(response.body.data.description).toBe(
        'The bus service was delayed.',
      );
      expect(response.body.data.relatedRideId).toBe(
        'RIDE-001',
      );
    });
  });
});