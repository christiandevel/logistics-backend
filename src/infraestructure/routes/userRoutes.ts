import { Router } from "express";

import { PostgresUserRepository } from "../repositories/postgresUserRepository";
import pool from "../config/database";

import { UserService } from "../../application/services/userService";
import { UserController } from "../server/controllers/userController";
import { authenticate } from "../server/middleware/auth";
import { checkRole } from "../server/middleware/checkRole";

const userRoutes = Router();

const userRepository = new PostgresUserRepository(pool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         email:
 *           type: string
 *           format: email
 *           description: The user email
 *         full_name:
 *           type: string
 *           description: The user's full name
 *         role:
 *           type: string
 *           enum: [admin, user, driver]
 *           description: The user's role
 *         email_verified:
 *           type: boolean
 *           description: Whether the user's email is verified
 *         requires_password_change:
 *           type: boolean
 *           description: Whether the user needs to change their password
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Get all users from the database (Admin only)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:	
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or invalid token
 *       403:
 *         description: Access denied. Admin role required
 *       500:
 *         description: Internal server error
 */
userRoutes.get('/', authenticate, checkRole(["admin"]), userController.findAll);

/**
 * @swagger
 * /api/users/{role}:
 *   get:
 *     summary: Get users by role (Admin only)
 *     description: Get users by role from the database (Admin only)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: role
 *         in: path
 *         required: true
 *         description: Role of the users to retrieve
 *         schema:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 *             - driver
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid role
 *       401:
 *         description: No token provided or invalid token
 *       403:
 *         description: Access denied. Admin role required
 *       500:
 *         description: Internal server error
 */
userRoutes.get('/:role', authenticate, checkRole(["admin"]), userController.findByRole);

export default userRoutes;