import { v4 as uuidv4 } from "uuid";
import { AuthUser, UserProps } from "../../domain/entities/auth";
import { AuthRepository } from "../../domain/ports/AuthRepository";
import { EmailService } from "./emailService";
import { comparePasswords, generateToken, hashPassword, TOKEN_EXPIRATION } from "../utils/authUtils";

export type LoginResponse = {
	user: AuthUser;
	token: string;
	status: "SUCCESS" | "REQUIRED_EMAIL_VERIFICATION" | "REQUIRED_PASSWORD_CHANGE";
}

export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly emailService: EmailService,
	) {}
	
	async registerUser(userData: Omit<UserProps, 'id'>): Promise<{ user: AuthUser; token: string }> {
		const existingUser = await this.authRepository.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("User already exists");
		}
		
		const hashedPassword = await hashPassword(userData.password);
		const confirmation_token = uuidv4();
		const confirmation_expires_at = new Date(Date.now() + TOKEN_EXPIRATION.EMAIL_VERIFICATION);
		
		const isDriver = userData.role === 'driver';
		
		const user = new AuthUser({
			...userData,
			password: hashedPassword,
			confirmation_token,
			confirmation_expires_at,
			requires_password_change: isDriver,
			email_verified: isDriver,
		});
		
		const createdUser = await this.authRepository.registerUser(user);
		const token = generateToken(createdUser);
		
		if (!isDriver) {
			await this.emailService.sendEmailConfirmationEmail(userData.email, confirmation_token);
		}
		
		return { user: createdUser, token };
	}
	
	async loginUser(email: string, password: string): Promise<LoginResponse> {
		const user = await this.authRepository.findByEmail(email);
		if (!user) {
			throw new Error("User not found");
		}
		
		const isPasswordCorrect = await comparePasswords(password, user.getPassword());
		if (!isPasswordCorrect) {
			throw new Error("Incorrect password");
		}
		
		const token = generateToken(user);
		let status: LoginResponse["status"] = "SUCCESS";
		
		if (!user.isEmailVerified() && user.getRole() !== 'driver') {
			status = "REQUIRED_EMAIL_VERIFICATION";
		} else if (user.requieresNewPassword()) {
			status = "REQUIRED_PASSWORD_CHANGE";
		}
		
		return { user, token, status };
	}
	
	async forgotPassword(email: string): Promise<{ userExists: boolean }> {
		const user = await this.authRepository.findByEmail(email);
		
		if (!user) {
			return { userExists: false };
		}

		const resetToken = uuidv4();
		const resetExpires = new Date(Date.now() + TOKEN_EXPIRATION.PASSWORD_RESET);
		
		await this.authRepository.forgotPassword(email, resetToken, resetExpires);
		await this.emailService.sendPasswordResetEmail(email, resetToken);
		
		return { userExists: true };
	}
	
	async resetPassword(token: string, newPassword: string): Promise<void> {
		const user = await this.authRepository.findByResetToken(token);
		
		if (!user) {
			throw new Error("Invalid or expired reset token");
		}

		const hashedPassword = await hashPassword(newPassword);
		await this.authRepository.resetPassword(user.getId(), hashedPassword);
	}
	
	async confirmEmail(token: string): Promise<void> {
		const user = await this.authRepository.findByConfirmationToken(token);
		if (!user) {
			throw new Error("Invalid confirmation token");
		}
		
		const confirmationExpirationTime = user.getConfirmationExpires();
		if (!confirmationExpirationTime || new Date() > confirmationExpirationTime) {
			throw new Error("Confirmation token expired");
		}
		
		user.setEmailVerified(true);
		await this.authRepository.updateUser(user);
	}
	
	async setInitialPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
		const user = await this.authRepository.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		if (!user.getRequiresPasswordChange()) {
			throw new Error("Password change not required for this user");
		}

		const isPasswordValid = await comparePasswords(currentPassword, user.getPassword());
		if (!isPasswordValid) {
			throw new Error("Current password is incorrect");
		}

		const hashedPassword = await hashPassword(newPassword);
		await this.authRepository.setInitialPassword(user.getId(), hashedPassword);
	}
}