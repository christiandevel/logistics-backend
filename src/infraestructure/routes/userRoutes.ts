import { Router } from "express";

import { PostgresUserRepository } from "../repositories/postgresUserRepository";
import pool from "../config/database";

import { UserService } from "../../application/services/userService";
import { UserController } from "../server/controllers/userController";
import { ValidateRequest } from "../validation/middleware/validationMiddleware";

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
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Get all users from the database
 *     tags: [User]
 *     responses:	
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
userRoutes.get('/', userController.findAll);

/**
 * @swagger
 * /api/users/{role}:
 *   get:
 *     summary: Get users by role
 *     description: Get users by role from the database
 *     tags: [User]
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
 *       500:
 *         description: Internal server error
 */
userRoutes.get('/:role', userController.findByRole);

export default userRoutes;