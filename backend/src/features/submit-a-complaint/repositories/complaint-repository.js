/**
 * @file Database repository for the Submit a Complaint feature.
 *
 * The Repository Layer is responsible only for communicating with
 * the database. Business rules and authorization remain in the
 * ComplaintService.
 */

export class ComplaintRepository {
  /**
   * Creates a complaint repository.
   *
   * @param {Object} db - Database client exposing an execute() method.
   */
  constructor(db) {
    if (!db || typeof db.execute !== 'function') {
      throw new Error('A valid database client is required.');
    }

    this.db = db;
  }

  /**
   * Creates a new complaint record.
   *
   * @param {Object} record - Database-ready complaint record.
   * @returns {Promise<Object>} Created database record.
   */
  async create(record) {
    const query = `
      INSERT INTO complaints (
        complaint_id,
        passenger_id,
        category,
        related_ride_id,
        description,
        status,
        admin_notes,
        reviewed_by,
        reviewed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      record.complaint_id,
      record.passenger_id,
      record.category,
      record.related_ride_id ?? null,
      record.description,
      record.status,
      record.admin_notes ?? null,
      record.reviewed_by ?? null,
      record.reviewed_at ?? null,
    ];

    const [result] = await this.db.execute(query, values);

    const createdRecord = await this.findById(result.insertId);

    if (!createdRecord) {
      throw new Error('Failed to retrieve created complaint.');
    }

    return createdRecord;
  }

  /**
   * Finds a complaint by its database numeric ID.
   *
   * @param {number} id - Database complaint ID.
   * @returns {Promise<Object|null>} Database record or null.
   */
  async findById(id) {
    const query = `
      SELECT *
      FROM complaints
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await this.db.execute(query, [id]);

    return rows[0] ?? null;
  }

  /**
   * Finds a complaint using its public complaint ID.
   *
   * @param {string} complaintId - Public complaint ID.
   * @returns {Promise<Object|null>} Database record or null.
   */
  async findByComplaintId(complaintId) {
    const query = `
      SELECT *
      FROM complaints
      WHERE complaint_id = ?
      LIMIT 1
    `;

    const [rows] = await this.db.execute(query, [complaintId]);

    return rows[0] ?? null;
  }

  /**
   * Finds all complaints belonging to a passenger.
   *
   * @param {string} passengerId - Passenger ID.
   * @returns {Promise<Array>} Complaint database records.
   */
  async findByPassengerId(passengerId) {
    const query = `
      SELECT *
      FROM complaints
      WHERE passenger_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await this.db.execute(query, [passengerId]);

    return rows;
  }

  /**
   * Finds all complaints.
   *
   * @returns {Promise<Array>} All complaint database records.
   */
  async findAll() {
    const query = `
      SELECT *
      FROM complaints
      ORDER BY created_at DESC
    `;

    const [rows] = await this.db.execute(query);

    return rows;
  }

  /**
   * Updates complaint status and administrator review information.
   *
   * @param {string} complaintId - Public complaint ID.
   * @param {Object} updateData - Status and review information.
   * @returns {Promise<Object>} Updated database record.
   */
  async updateStatus(complaintId, updateData) {
    const query = `
      UPDATE complaints
      SET
        status = ?,
        admin_notes = ?,
        reviewed_by = ?,
        reviewed_at = ?
      WHERE complaint_id = ?
    `;

    const values = [
      updateData.status,
      updateData.admin_notes ?? null,
      updateData.reviewed_by ?? null,
      updateData.reviewed_at ?? null,
      complaintId,
    ];

    const [result] = await this.db.execute(query, values);

    if (result.affectedRows === 0) {
      throw new Error('Complaint not found.');
    }

    const updatedRecord = await this.findByComplaintId(complaintId);

    if (!updatedRecord) {
      throw new Error('Failed to retrieve updated complaint.');
    }

    return updatedRecord;
  }
}