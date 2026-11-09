/**
 * @fileoverview Express routes for Fare calculation and Overcharge reporting with Swagger specs.
 * @module features/fare/fareRoutes
 * @author Nazmus Sakib
 * @version 1.0.0
 */

import express from 'express';
import { fareController } from './fareController.js';

const router = express.Router();

/**
 * @openapi
 * /api/fares:
 *   get:
 *     summary: Retrieve all official campus fare charts
 *     description: Returns the list of all predefined transit routes inside Jahangirnagar University.
 *     tags:
 *       - Fare
 *     responses:
 *       200:
 *         description: Successfully fetched predefined fare routes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       from:
 *                         type: string
 *                         example: Dairy Gate
 *                       to:
 *                         type: string
 *                         example: Bottola
 *                       rickshawFare:
 *                         type: number
 *                         example: 20
 *                       autoFare:
 *                         type: number
 *                         example: 15
 */
router.get('/', fareController.getPredefinedFares);

/**
 * @openapi
 * /api/fares/calculate:
 *   get:
 *     summary: Calculate fare between two campus locations
 *     description: Checks the official fare for both Rickshaw and Battery Auto between two locations.
 *     tags:
 *       - Fare
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Starting campus point (e.g., Dairy Gate)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination campus point (e.g., Bottola)
 *     responses:
 *       200:
 *         description: Fare details retrieved successfully.
 *       400:
 *         description: Invalid or identical locations provided.
 *       404:
 *         description: Route not found.
 */
router.get('/calculate', fareController.calculateRouteFare);

/**
 * @openapi
 * /api/fares/report-overcharge:
 *   post:
 *     summary: Submit an overcharge complaint
 *     description: Allows passengers to submit complaints when drivers demand more than the official rate.
 *     tags:
 *       - Fare
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickup
 *               - destination
 *               - vehicleType
 *               - demandedFare
 *             properties:
 *               pickup:
 *                 type: string
 *                 example: Dairy Gate
 *               destination:
 *                 type: string
 *                 example: Bottola
 *               vehicleType:
 *                 type: string
 *                 enum: [Rickshaw, Battery Auto]
 *                 example: Rickshaw
 *               demandedFare:
 *                 type: number
 *                 example: 35
 *               officialFare:
 *                 type: number
 *                 example: 20
 *               vehicleNumber:
 *                 type: string
 *                 example: JU-AUTO-104
 *               comment:
 *                 type: string
 *                 example: Driver refused to take the standard fare.
 *     responses:
 *       201:
 *         description: Complaint submitted successfully.
 *       400:
 *         description: Missing required fields.
 */
router.post('/report-overcharge', fareController.submitOverchargeReport);

export default router;