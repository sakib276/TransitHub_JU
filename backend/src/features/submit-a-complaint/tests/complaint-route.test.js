/**
 * @file Unit tests for Complaint routes.
 *
 * The Route Layer is responsible for mapping HTTP endpoints
 * to the appropriate ComplaintController methods.
 *
 * These tests verify:
 * - Correct HTTP methods are registered.
 * - Correct endpoint paths are registered.
 * - Requests are forwarded to the correct controller methods.
 * - Route definitions remain independent from business logic.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createComplaintRoutes } from '../routes/complaint-routes.js';

describe('Complaint Routes', () => {
  let router;
  let controller;

  beforeEach(() => {
    controller = {
      createComplaint: vi.fn(),
      getPassengerComplaints: vi.fn(),
      getComplaintById: vi.fn(),
      getAllComplaints: vi.fn(),
      updateComplaintStatus: vi.fn(),
    };

    router = createComplaintRoutes(controller);
  });

  /**
   * Finds a registered route by HTTP method and path.
   */
  const findRoute = (method, path) =>
    router.stack.find(
      (layer) =>
        layer.route &&
        layer.route.path === path &&
        layer.route.methods[method],
    );

  describe('POST /', () => {
    it('registers the create complaint endpoint', () => {
      const route = findRoute('post', '/');

      expect(route).toBeDefined();
    });

    it('maps POST / to createComplaint controller method', () => {
      const route = findRoute('post', '/');

      expect(route.route.stack).toHaveLength(1);
      expect(route.route.stack[0].handle).toBe(
        controller.createComplaint,
      );
    });
  });

  describe('GET /', () => {
    it('registers the passenger complaint history endpoint', () => {
      const route = findRoute('get', '/');

      expect(route).toBeDefined();
    });

    it('maps GET / to getPassengerComplaints controller method', () => {
      const route = findRoute('get', '/');

      expect(route.route.stack).toHaveLength(1);
      expect(route.route.stack[0].handle).toBe(
        controller.getPassengerComplaints,
      );
    });
  });

  describe('GET /all', () => {
    it('registers the administrator complaint listing endpoint', () => {
      const route = findRoute('get', '/all');

      expect(route).toBeDefined();
    });

    it('maps GET /all to getAllComplaints controller method', () => {
      const route = findRoute('get', '/all');

      expect(route.route.stack).toHaveLength(1);
      expect(route.route.stack[0].handle).toBe(
        controller.getAllComplaints,
      );
    });
  });

  describe('GET /:complaintId', () => {
    it('registers the single complaint endpoint', () => {
      const route = findRoute('get', '/:complaintId');

      expect(route).toBeDefined();
    });

    it('maps GET /:complaintId to getComplaintById controller method', () => {
      const route = findRoute('get', '/:complaintId');

      expect(route.route.stack).toHaveLength(1);
      expect(route.route.stack[0].handle).toBe(
        controller.getComplaintById,
      );
    });
  });

  describe('PATCH /:complaintId/status', () => {
    it('registers the complaint status update endpoint', () => {
      const route = findRoute('patch', '/:complaintId/status');

      expect(route).toBeDefined();
    });

    it('maps PATCH /:complaintId/status to updateComplaintStatus', () => {
      const route = findRoute('patch', '/:complaintId/status');

      expect(route.route.stack).toHaveLength(1);
      expect(route.route.stack[0].handle).toBe(
        controller.updateComplaintStatus,
      );
    });
  });

  describe('Route count', () => {
    it('registers exactly five complaint endpoints', () => {
      expect(router.stack).toHaveLength(5);
    });
  });
});