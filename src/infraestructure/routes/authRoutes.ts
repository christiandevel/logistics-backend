import { Router } from "express";
import { PostgresAuthRepository } from "../repositories/postgresAuthRepository";
import pool from "../config/database";
import { AuthService } from "../../application/services/authServices";
import { AuthController } from "../server/controllers/authController";
import { ValidateRequest } from "../validation/middleware/validationMiddleware";
import { loginSchema, registerSchema } from "../validation/schemas/authSchema";
import { EmailSenderFactory } from "../email/emailSenderFactory";
import { EmailService } from "../../application/services/emailService";

const router = Router();

const authRepository = new PostgresAuthRepository(pool);
const emailSender = EmailSenderFactory.create(process.env.EMAIL_TYPE as any || "nodemailer");
const emailService = new EmailService(emailSender);
const authService = new AuthService(authRepository, emailService);
const authController = new AuthController(authService);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *               full_name:
 *                 type: string
 *                 description: User full name
 *               role:
 *                 type: string
 *                 description: User role
 *                 enum:
 *                   - admin
 *                   - user
 *                   - driver
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/register", ValidateRequest(registerSchema), authController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/login", ValidateRequest(loginSchema), authController.loginUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *     responses:
 *       200:
 *         description: Password forgotten successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               password:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", authController.resetPassword);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     description: Change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               password:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/change-password", authController.changePassword);

/**
 * @swagger
 * /api/auth/confirm-email:
 *   post:
 *     summary: Confirm email
 *     description: Confirm email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Email confirmation token
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/confirm-email", authController.confirmEmail);

/**
 * @swagger
 * /api/auth/set-initial-password:
 *   post:
 *     summary: Set initial password
 *     description: Set initial password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password set successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/set-initial-password", authController.setInitialPassword);

export default router;
