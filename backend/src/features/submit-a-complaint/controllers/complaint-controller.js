/**
 * @file Complaint Controller.
 *
 * The Controller Layer is responsible for:
 * - Reading HTTP request data.
 * - Passing data to the ComplaintService.
 * - Returning appropriate HTTP responses.
 * - Translating service errors into HTTP responses.
 *
 * Business logic and database operations belong to the Service
 * and Repository layers respectively.
 */

export class ComplaintController {
  /**
   * Creates a ComplaintController.
   *
   * @param {Object} complaintService - Complaint service dependency.
   */
 constructor(complaintService) {
  this.complaintService = complaintService;

  // Bind controller methods so that `this` continues to
  // refer to the ComplaintController instance when Express
  // calls these methods as route handlers.
  this.createComplaint = this.createComplaint.bind(this);
  this.getPassengerComplaints =
    this.getPassengerComplaints.bind(this);
  this.getComplaintById =
    this.getComplaintById.bind(this);
  this.getAllComplaints =
    this.getAllComplaints.bind(this);
  this.updateComplaintStatus =
    this.updateComplaintStatus.bind(this);
  this.handleError = this.handleError.bind(this);
}

  /**
   * Creates a new complaint.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} HTTP response.
   */
  async createComplaint(req, res) {
    try {
      const complaint = await this.complaintService.createComplaint(
        req.body,
        req.user,
      );

      return res.status(201).json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /**
   * Gets all complaints belonging to the authenticated passenger.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} HTTP response.
   */
  async getPassengerComplaints(req, res) {
    try {
      const complaints =
        await this.complaintService.getPassengerComplaints(
          req.user.id,
        );

      return res.status(200).json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /**
   * Gets a complaint by its complaint ID.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} HTTP response.
   */
  async getComplaintById(req, res) {
    try {
      const complaint = await this.complaintService.getComplaintById(
        req.params.complaintId,
        req.user,
      );

      return res.status(200).json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /**
   * Gets all complaints.
   *
   * Access control is handled by the service layer.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} HTTP response.
   */
  async getAllComplaints(req, res) {
    try {
      const complaints =
        await this.complaintService.getAllComplaints(req.user);

      return res.status(200).json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /**
   * Updates the status of a complaint.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} HTTP response.
   */
  async updateComplaintStatus(req, res) {
    try {
      const updatedComplaint =
        await this.complaintService.updateComplaintStatus(
          req.params.complaintId,
          req.body,
          req.user,
        );

      return res.status(200).json({
        success: true,
        data: updatedComplaint,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /**
   * Converts service errors into HTTP responses.
   *
   * @param {Object} res - Express response object.
   * @param {Error} error - Error thrown by the service layer.
   * @returns {Object} HTTP error response.
   */
  handleError(res, error) {
    const statusCode = error.statusCode || 500;

    const response = {
      success: false,
      message: error.message || 'Internal server error.',
    };

    if (error.errors) {
      response.errors = error.errors;
    }

    return res.status(statusCode).json(response);
  }
}