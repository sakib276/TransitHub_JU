/**
 * @fileOverview Express routes and OpenAPI annotations for ride requests.
 */

import express from "express";
import {
  acceptRideRequest,
  createRideRequest,
  getDriverVehicleDetails,
  listAvailableDrivers,
  listLocations,
  listRideRequests,
  rejectRideRequest,
  updateDriverStatus,
} from "../controllers/ride-request-controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/locations:
 *   get:
 *     operationId: listLocations
 *     summary: List active campus locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Active pickup and destination locations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [data]
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Location'
 *       500:
 *         description: Database or server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/locations", listLocations);

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     operationId: listAvailableDrivers
 *     summary: Find available drivers with enough seats
 *     tags: [Drivers]
 *     parameters:
 *       - in: query
 *         name: seatsNeeded
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *         example: 2
 *     responses:
 *       200:
 *         description: Drivers with active vehicles and sufficient available seats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AvailableDriver'
 *       400:
 *         description: Invalid requested seat count.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/drivers", listAvailableDrivers);

/**
 * @swagger
 * /api/drivers/{driverId}/vehicle:
 *   get:
 *     operationId: getDriverVehicle
 *     summary: Get an active driver's vehicle
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Active vehicle assigned to the driver.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/DriverVehicle'
 *       400:
 *         description: Invalid identifier.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No matching active driver vehicle exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/drivers/:driverId/vehicle", getDriverVehicleDetails);

/**
 * @swagger
 * /api/drivers/{driverId}/status:
 *   patch:
 *     operationId: updateDriverStatus
 *     summary: Set a driver's operational availability
 *     description: Demo-ID based endpoint. Replace with authenticated driver identity before deployment.
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicleId, status]
 *             properties:
 *               vehicleId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Available, Offline]
 *     responses:
 *       200:
 *         description: Driver status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     driverId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     status: { type: string, enum: [Available, Offline] }
 *       400:
 *         description: Invalid status, driver, vehicle, or availability transition.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/drivers/:driverId/status", updateDriverStatus);

/**
 * @swagger
 * /api/ride-requests:
 *   get:
 *     operationId: listRideRequests
 *     summary: List passenger queue entries
 *     description: The optional demo identifiers are filters only and do not authenticate callers.
 *     tags: [Ride requests]
 *     parameters:
 *       - in: query
 *         name: passengerId
 *         schema:
 *           type: integer
 *         description: Filter to a passenger's entries.
 *       - in: query
 *         name: driverId
 *         schema:
 *           type: integer
 *         description: Hide waiting entries previously declined by this driver.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Waiting, Assigned, Completed, No-show, Cancelled]
 *     responses:
 *       200:
 *         description: Matching queue entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RideRequest'
 *       400:
 *         description: Invalid query value.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database or server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     operationId: createRideRequest
 *     summary: Join the passenger queue
 *     description: Passenger ID is a temporary development value until authenticated login is integrated.
 *     tags: [Ride requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [passengerId, pickupLocationId, destinationLocationId, seatsNeeded]
 *             properties:
 *               passengerId:
 *                 type: integer
 *                 example: 1
 *               pickupLocationId:
 *                 type: integer
 *                 example: 1
 *               destinationLocationId:
 *                 type: integer
 *                 example: 2
 *               seatsNeeded:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 4
 *                 example: 2
 *               genderPreference:
 *                 type: string
 *                 enum: [Any, Male, Female]
 *                 default: Any
 *               priority:
 *                 type: boolean
 *                 default: false
 *               priorityReason:
 *                 type: string
 *                 enum: [Medical emergency, Academic emergency, Other]
 *     responses:
 *       201:
 *         description: Passenger entered the queue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/RideRequest'
 *       400:
 *         description: Invalid request data or an active request already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Passenger or active location was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database or server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/ride-requests", listRideRequests);
router.post("/ride-requests", createRideRequest);

/**
 * @swagger
 * /api/ride-requests/{id}/accept:
 *   post:
 *     operationId: acceptRideRequest
 *     summary: Assign a waiting request to a driver and vehicle
 *     description: Updates queue entry, assignment, and vehicle seats in one database transaction.
 *     tags: [Ride requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [driverId, vehicleId, seatsAssigned]
 *             properties:
 *               driverId: { type: integer, example: 4 }
 *               vehicleId: { type: integer, example: 1 }
 *               seatsAssigned: { type: integer, minimum: 1, example: 2 }
 *     responses:
 *       201:
 *         description: Queue assignment created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     rideRequestId: { type: integer }
 *                     driverId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     seatsAssigned: { type: integer }
 *       400:
 *         description: Request is no longer waiting, driver unavailable, or insufficient seats.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ride request does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database or server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/ride-requests/:id/accept", acceptRideRequest);

/**
 * @swagger
 * /api/ride-requests/{id}/reject:
 *   post:
 *     operationId: rejectRideRequest
 *     summary: Cancel a passenger request or decline it as a driver
 *     description: With driverId in the JSON body this records a driver-specific decline and keeps the passenger queued; without it, cancels a waiting passenger request.
 *     tags: [Ride requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: integer
 *                 description: Provide for driver-specific decline; omit to cancel as passenger.
 *     responses:
 *       200:
 *         description: Request cancelled or driver offer declined.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Request is not waiting or driver has already declined.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ride request does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database or server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/ride-requests/:id/reject", rejectRideRequest);

export default router;
