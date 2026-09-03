import { describe, expect, it, beforeAll, afterAll } from 'vitest';

import { createDatabase } from '../../../config/database.js';

/**
 * Tests the Submit a Complaint feature against the real MySQL database.
 *
 * Unlike the regular integration test, which uses a mock database,
 * this test verifies the actual database connection, complaints table,
 * INSERT operation, and SELECT operation.
 *
 * The test creates a temporary complaint record and removes it after
 * verification so that test data is not permanently stored.
 */
describe('Submit a Complaint - Real Database Integration', () => {
  /** @type {import('mysql2/promise').Pool} */
  let db;

  /**
   * Creates the real MySQL connection pool and verifies
   * that the database is available before running the tests.
   */
  beforeAll(async () => {
    db = createDatabase();

    await db.execute('SELECT 1');
  });

  /**
   * Closes the database connection pool after all tests finish.
   */
  afterAll(async () => {
    await db.end();
  });

  /**
   * Verifies that the application can connect to the real
   * MySQL database configured in the environment.
   */
  it('should connect to the real MySQL database', async () => {
    const [rows] = await db.execute('SELECT 1 AS connected');

    expect(rows[0].connected).toBe(1);
  });

  /**
   * Verifies that the complaints table exists in the
   * TransitHub_JU database.
   */
  it('should have the complaints table', async () => {
    const [rows] = await db.execute(`
      SHOW TABLES LIKE 'complaints'
    `);

    expect(rows).toHaveLength(1);
  });

  /**
   * Verifies that a complaint can be inserted into and
   * retrieved from the real MySQL database.
   */
  it('should be able to insert and retrieve a complaint', async () => {
    const complaintId = `TEST-${Date.now()}`;

    await db.execute(
      `
      INSERT INTO complaints (
        complaint_id,
        passenger_id,
        category,
        related_ride_id,
        description,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        complaintId,
        'TEST-PASSENGER',
        'SERVICE',
        'TEST-RIDE',
        'Automated real database integration test.',
        'UNDER_REVIEW',
      ],
    );

    const [rows] = await db.execute(
      `
      SELECT *
      FROM complaints
      WHERE complaint_id = ?
      `,
      [complaintId],
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].complaint_id).toBe(complaintId);
    expect(rows[0].passenger_id).toBe('TEST-PASSENGER');
    expect(rows[0].category).toBe('SERVICE');
    expect(rows[0].status).toBe('UNDER_REVIEW');

    /**
     * Remove the temporary test record so that the real
     * database remains clean after the test.
     */
    await db.execute(
      `
      DELETE FROM complaints
      WHERE complaint_id = ?
      `,
      [complaintId],
    );
  });
});