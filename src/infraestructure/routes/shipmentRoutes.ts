import { Router } from "express";

import pool from "../config/database";
import { PostgresShipmentRepository } from "../repositories/postgresShipmentRepository";

import { authenticate } from "../server/middleware/auth";
import { checkRole } from "../server/middleware/checkRole";

import { ShipmentService } from "../../application/services/shipmentService";
import { ShipmentController } from "../server/controllers/shipmentController";
import { createShipmentSchema } from "../validation/schemas/shipmentSchema";
import { ValidateRequest } from "../validation/middleware/validationMiddleware";

const shipmentRoutes = Router();

const shipmentRepository = new PostgresShipmentRepository(pool);
const shipmentService = new ShipmentService(shipmentRepository);
const shipmentController = new ShipmentController(shipmentService);

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: API endpoints for managing shipments
 * 
 * components:
 *   schemas:
 *     NewShipment:
 *       type: object
 *       required:
 *         - userId
 *         - origin
 *         - destination
 *         - destinationZipcode
 *         - destinationCity
 *         - weight
 *         - productType
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user creating the shipment
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         origin:
 *           type: string
 *           description: Complete pickup address
 *           example: "123 Main St, New York, NY 10001"
 *         destination:
 *           type: string
 *           description: Complete delivery address
 *           example: "456 Park Ave, Los Angeles, CA 90001"
 *         destinationZipcode:
 *           type: string
 *           description: Zipcode of the delivery location
 *           example: "90001"
 *         destinationCity:
 *           type: string
 *           description: City of the delivery location
 *           example: "Los Angeles"
 *         weight:
 *           type: number
 *           description: Package weight in kilograms
 *           example: 5.5
 *         width:
 *           type: number
 *           description: Package width in centimeters
 *           example: 30
 *         height:
 *           type: number
 *           description: Package height in centimeters
 *           example: 20
 *         length:
 *           type: number
 *           description: Package length in centimeters
 *           example: 40
 *         productType:
 *           type: string
 *           enum: [REGULAR, FRAGILE, HAZARDOUS]
 *           description: Type of product being shipped
 *           example: "REGULAR"
 *         isFragile:
 *           type: boolean
 *           description: Indicates if special handling is required
 *           example: false
 *         specialInstructions:
 *           type: string
 *           description: Additional handling instructions
 *           example: "Please handle with care"
 *     Shipment:
 *       allOf:
 *         - $ref: '#/components/schemas/NewShipment'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Unique shipment identifier
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             driverId:
 *               type: string
 *               description: ID of the assigned driver
 *               example: "123e4567-e89b-12d3-a456-426614174111"
 *             trackingNumber:
 *               type: string
 *               description: Unique tracking number for the shipment
 *               example: "SHIP123456789"
 *             status:
 *               type: string
 *               enum: [PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED]
 *               description: Current status of the shipment
 *               example: "PENDING"
 *             estimatedDeliveryDate:
 *               type: string
 *               format: date-time
 *               description: Expected delivery date and time
 *               example: "2024-03-20T15:00:00Z"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the shipment was created
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp of the last update
 *     ShipmentHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the history entry
 *         shipmentId:
 *           type: string
 *           description: ID of the associated shipment
 *         status:
 *           type: string
 *           enum: [PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED]
 *           description: Status recorded in this history entry
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When this status change occurred
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         status:
 *           type: string
 *           enum: [ERROR]
 *           description: Error status indicator
 */

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create a new shipment
 *     description: Creates a new shipment with the provided details. The user ID is obtained from the JWT token.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - destinationZipcode
 *               - destinationCity
 *               - weight
 *               - productType
 *             properties:
 *               origin:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 description: Complete pickup address
 *                 example: "123 Main St, New York, NY 10001"
 *               destination:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 description: Complete delivery address
 *                 example: "456 Park Ave, Los Angeles, CA 90001"
 *               destinationZipcode:
 *                 type: string
 *                 pattern: '^[0-9]{5}$'
 *                 description: 5-digit zipcode of the delivery location
 *                 example: "90001"
 *               destinationCity:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: City of the delivery location
 *                 example: "Los Angeles"
 *               weight:
 *                 type: number
 *                 minimum: 0.1
 *                 maximum: 1000
 *                 description: Package weight in kilograms
 *                 example: 5.5
 *               width:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 200
 *                 description: Package width in centimeters
 *                 example: 30
 *               height:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 200
 *                 description: Package height in centimeters
 *                 example: 20
 *               length:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 200
 *                 description: Package length in centimeters
 *                 example: 40
 *               productType:
 *                 type: string
 *                 enum: [REGULAR, FRAGILE, HAZARDOUS]
 *                 description: Type of product being shipped
 *                 example: "REGULAR"
 *               isFragile:
 *                 type: boolean
 *                 description: Indicates if special handling is required
 *                 example: false
 *               specialInstructions:
 *                 type: string
 *                 maxLength: 500
 *                 description: Additional handling instructions
 *                 example: "Please handle with care"
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipment'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing validation failures
 *                   example: "Invalid input data"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         description: Field that failed validation
 *                         example: "weight"
 *                       message:
 *                         type: string
 *                         description: Validation error message
 *                         example: "Weight must be between 0.1 and 1000 kg"
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.post('/', authenticate, ValidateRequest(createShipmentSchema), shipmentController.createShipment);

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments
 *     description: Retrieves all shipments from the system. Requires admin role.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all shipments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shipment'
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       403:
 *         description: Forbidden - Requires admin role
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.get('/', authenticate, checkRole(["admin"]), shipmentController.findAllShipments);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     description: Retrieves detailed information about a specific shipment.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the shipment
 *     responses:
 *       200:
 *         description: Shipment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipment'
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.get('/:id', authenticate, shipmentController.findShipmentById);

/**
 * @swagger
 * /api/shipments/user/{userId}:
 *   get:
 *     summary: Get shipments by user ID
 *     description: Retrieves all shipments associated with a specific user.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose shipments to retrieve
 *     responses:
 *       200:
 *         description: User's shipments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shipment'
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.get('/user/:userId', authenticate, shipmentController.findShipmentsByUserId);

/**
 * @swagger
 * /api/shipments/{id}/status:
 *   put:
 *     summary: Update shipment status
 *     description: Updates the status of a specific shipment. Requires admin role.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shipment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED]
 *                 description: New status for the shipment
 *     responses:
 *       200:
 *         description: Shipment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipment'
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.put('/:id/status', authenticate, checkRole(["admin"]), shipmentController.changeShipmentStatus);

/**
 * @swagger
 * /api/shipments/{id}/driver:
 *   put:
 *     summary: Assign driver to shipment
 *     description: Assigns a driver to a specific shipment. Requires admin role.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shipment to assign driver to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: ID of the driver to assign
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipment'
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Shipment or driver not found
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.put('/:id/driver', authenticate, checkRole(["admin"]), shipmentController.changeShipmentDriver);

/**
 * @swagger
 * /api/shipments/{id}/history:
 *   get:
 *     summary: Get shipment history
 *     description: Retrieves the status change history of a specific shipment.
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shipment to get history for
 *     responses:
 *       200:
 *         description: Shipment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShipmentHistory'
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
shipmentRoutes.get('/:id/history', authenticate, shipmentController.getShipmentHistory);

export default shipmentRoutes;