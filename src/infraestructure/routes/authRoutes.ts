import { Router } from "express";
import { PostgresAuthRepository } from "../repositories/postgresAuthRepository";
import pool from "../config/database";
import { AuthService } from "../../application/services/authServices";
import { AuthController } from "../server/controllers/authController";
import { ValidateRequest } from "../validation/middleware/validationMiddleware";
import { loginSchema, registerSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema, setInitialPasswordSchema } from "../validation/schemas/authSchema";
import { EmailSenderFactory } from "../email/emailSenderFactory";
import { EmailService } from "../../application/services/emailService";

const authRoutes = Router();

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
 *     description: Register a new user with email verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User password (minimum 8 characters)
 *               full_name:
 *                 type: string
 *                 description: User's full name
 *               role:
 *                 type: string
 *                 enum: [admin, user, driver]
 *                 description: User role
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required | Password must be at least 8 characters | Role must be one of the following: admin, user, driver"
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/register", ValidateRequest(registerSchema), authController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [SUCCESS, REQUIRED_EMAIL_VERIFICATION, REQUIRED_PASSWORD_CHANGE]
 *       400:
 *         description: Invalid credentials or validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/login", ValidateRequest(loginSchema), authController.loginUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send a password reset link to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *     responses:
 *       200:
 *         description: If the email exists, a reset link will be sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userExists:
 *                   type: boolean
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/forgot-password", ValidateRequest(forgotPasswordSchema), authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset user password using a valid reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 format: uuid
 *                 description: Password reset token (UUID v4)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password (must match password)
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token, expired token, or passwords don't match
 *       404:
 *         description: Token not found or expired
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/reset-password", ValidateRequest(resetPasswordSchema), authController.resetPassword);

/**
 * @swagger
 * /api/auth/confirm-email:
 *   post:
 *     summary: Confirm email address
 *     description: Verify user's email address using confirmation token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 format: uuid
 *                 description: Email confirmation token (UUID v4)
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       400:
 *         description: Invalid token format
 *       404:
 *         description: Token not found or expired
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/confirm-email", ValidateRequest(verifyEmailSchema), authController.confirmEmail);

/**
 * @swagger
 * /api/auth/set-initial-password:
 *   post:
 *     summary: Set initial password for users that require password change
 *     description: Changes the password for users with requires_password_change flag set to true
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password (minimum 8 characters)
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password (must match newPassword)
 *     responses:
 *       200:
 *         description: Password set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *                 status:
 *                   type: string
 *                   enum: [SUCCESS]
 *       400:
 *         description: Validation error or password change not required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect | New password must be at least 8 characters | Passwords do not match"
 *                 status:
 *                   type: string
 *                   enum: [ERROR]
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/set-initial-password", ValidateRequest(setInitialPasswordSchema), authController.setInitialPassword);

export default authRoutes;
