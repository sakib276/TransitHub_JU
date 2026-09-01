/**
 * @file Unit tests for the Complaint Controller.
 *
 * The Controller Layer is responsible for:
 * - Reading HTTP request data.
 * - Passing data to the ComplaintService.
 * - Returning appropriate HTTP responses.
 * - Translating service errors into HTTP responses.
 *
 * The controller must NOT:
 * - Contain database queries.
 * - Contain complaint business rules.
 * - Perform authentication logic.
 *
 * The ComplaintService is mocked in these tests so that the
 * controller can be tested independently.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ComplaintController } from '../controllers/complaint-controller.js';

describe('ComplaintController', () => {
  let service;
  let controller;
  let req;
  let res;

  beforeEach(() => {
    /**
     * Mock ComplaintService.
     *
     * Each service method is mocked because business logic
     * belongs to the Service Layer, not the Controller.
     */
    service = {
      createComplaint: vi.fn(),
      getPassengerComplaints: vi.fn(),
      getComplaintById: vi.fn(),
      getAllComplaints: vi.fn(),
      updateComplaintStatus: vi.fn(),
    };

    controller = new ComplaintController(service);

    /**
     * Mock Express request object.
     */
    req = {
      body: {},
      params: {},
      user: null,
    };

    /**
     * Mock Express response object.
     *
     * Each method returns `res` so that Express-style
     * response chaining works.
     */
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('constructor', () => {
    it('creates a controller with a valid service dependency', () => {
      expect(controller).toBeInstanceOf(ComplaintController);
    });
  });

  describe('createComplaint', () => {
    it('creates a complaint and returns HTTP 201', async () => {
      const createdComplaint = {
        id: 1,
        complaintId: 'CMP-2026-001',
        passengerId: 'passenger-101',
        category: 'DRIVER',
        description: 'Driver complaint.',
        status: 'UNDER_REVIEW',
      };

      req.body = {
        category: 'DRIVER',
        relatedRideId: 'RIDE-001',
        description: 'Driver complaint.',
      };

      req.user = {
        id: 'passenger-101',
        role: 'PASSENGER',
      };

      service.createComplaint.mockResolvedValue(createdComplaint);

      await controller.createComplaint(req, res);

      expect(service.createComplaint).toHaveBeenCalledWith(
        req.body,
        req.user,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdComplaint,
      });
    });

    it('returns HTTP 400 when the service reports a validation error', async () => {
      const error = new Error('Validation failed.');
      error.statusCode = 400;
      error.errors = {
        description: 'Description is required.',
      };

      req.body = {};
      req.user = {
        id: 'passenger-101',
        role: 'PASSENGER',
      };

      service.createComplaint.mockRejectedValue(error);

      await controller.createComplaint(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
    });

    it('returns HTTP 401 when the user is unauthorized', async () => {
      const error = new Error(
        'Unauthorized: User identity is required.',
      );

      error.statusCode = 401;

      service.createComplaint.mockRejectedValue(error);

      await controller.createComplaint(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
    });
  });

  describe('getPassengerComplaints', () => {
    it('returns passenger complaints with HTTP 200', async () => {
      const complaints = [
        {
          complaintId: 'CMP-2026-001',
          passengerId: 'passenger-101',
          category: 'DRIVER',
          status: 'UNDER_REVIEW',
        },
      ];

      req.user = {
        id: 'passenger-101',
        role: 'PASSENGER',
      };

      service.getPassengerComplaints.mockResolvedValue(complaints);

      await controller.getPassengerComplaints(req, res);

      expect(service.getPassengerComplaints).toHaveBeenCalledWith(
        'passenger-101',
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: complaints,
      });
    });
  });

  describe('getComplaintById', () => {
    it('returns a complaint with HTTP 200', async () => {
      const complaint = {
        complaintId: 'CMP-2026-001',
        passengerId: 'passenger-101',
        category: 'DRIVER',
        status: 'UNDER_REVIEW',
      };

      req.params = {
        complaintId: 'CMP-2026-001',
      };

      req.user = {
        id: 'passenger-101',
        role: 'PASSENGER',
      };

      service.getComplaintById.mockResolvedValue(complaint);

      await controller.getComplaintById(req, res);

      expect(service.getComplaintById).toHaveBeenCalledWith(
        'CMP-2026-001',
        req.user,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: complaint,
      });
    });

    it('returns HTTP 404 when the complaint does not exist', async () => {
      const error = new Error('Complaint not found.');
      error.statusCode = 404;

      req.params = {
        complaintId: 'CMP-999',
      };

      service.getComplaintById.mockRejectedValue(error);

      await controller.getComplaintById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Complaint not found.',
      });
    });

    it('returns HTTP 403 when the passenger does not own the complaint', async () => {
      const error = new Error(
        'Forbidden: You do not have permission to view this complaint.',
      );

      error.statusCode = 403;

      req.params = {
        complaintId: 'CMP-2026-001',
      };

      req.user = {
        id: 'passenger-999',
        role: 'PASSENGER',
      };

      service.getComplaintById.mockRejectedValue(error);

      await controller.getComplaintById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
    });
  });

  describe('getAllComplaints', () => {
    it('returns all complaints for an administrator', async () => {
      const complaints = [
        {
          complaintId: 'CMP-2026-001',
          passengerId: 'passenger-101',
          status: 'UNDER_REVIEW',
        },
      ];

      req.user = {
        id: 'admin-001',
        role: 'ADMIN',
      };

      service.getAllComplaints.mockResolvedValue(complaints);

      await controller.getAllComplaints(req, res);

      expect(service.getAllComplaints).toHaveBeenCalledWith(req.user);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: complaints,
      });
    });

    it('returns HTTP 403 when a non-admin requests all complaints', async () => {
      const error = new Error(
        'Forbidden: Only administrators can view all complaints.',
      );

      error.statusCode = 403;

      req.user = {
        id: 'passenger-101',
        role: 'PASSENGER',
      };

      service.getAllComplaints.mockRejectedValue(error);

      await controller.getAllComplaints(req, res);

      expect(res.status).toHaveBeenCalledWith(403);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
    });
  });

  describe('updateComplaintStatus', () => {
    it('updates complaint status and returns HTTP 200', async () => {
      const updatedComplaint = {
        complaintId: 'CMP-2026-001',
        passengerId: 'passenger-101',
        status: 'RESOLVED',
        adminNotes: 'Issue resolved.',
        reviewedBy: 'admin-001',
      };

      req.params = {
        complaintId: 'CMP-2026-001',
      };

      req.body = {
        status: 'RESOLVED',
        adminNotes: 'Issue resolved.',
      };

      req.user = {
        id: 'admin-001',
        role: 'ADMIN',
      };

      service.updateComplaintStatus.mockResolvedValue(
        updatedComplaint,
      );

      await controller.updateComplaintStatus(req, res);

      expect(service.updateComplaintStatus).toHaveBeenCalledWith(
        'CMP-2026-001',
        req.body,
        req.user,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedComplaint,
      });
    });

    it('returns HTTP 403 when a non-admin updates complaint status', async () => {
      const error = new Error(
        'Forbidden: Only administrators can update complaint status.',
      );

      error.statusCode = 403;

      req.params = {
        complaintId: 'CMP-2026-001',
      };

      req.body = {
        status: 'RESOLVED',
      };

      req.user = {
        id: 'passenger-101',
        role: 'PASSENGER',
      };

      service.updateComplaintStatus.mockRejectedValue(error);

      await controller.updateComplaintStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(403);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
    });

    it('returns HTTP 400 when the status payload is invalid', async () => {
      const error = new Error('Validation failed.');
      error.statusCode = 400;
      error.errors = {
        status: 'Invalid complaint status.',
      };

      req.params = {
        complaintId: 'CMP-2026-001',
      };

      req.body = {
        status: 'INVALID_STATUS',
      };

      req.user = {
        id: 'admin-001',
        role: 'ADMIN',
      };

      service.updateComplaintStatus.mockRejectedValue(error);

      await controller.updateComplaintStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
    });
  });
});