import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { AuthUser, UserProps } from "../../domain/entities/auth";
import { AuthRepository } from "../../domain/ports/AuthRepository";
import { EmailService } from "./emailService";

export type LoginResponse = {
	user: AuthUser;
	token: string;
	status: "SUCCESS" | "REQUIRED_EMAIL_VERIFICATION" | "INCORRECT_PASSWORD";
}

export class AuthService {
	
	private emailVerificationExpirationTime: number = 24 * 60 * 60 * 1000; // 1 day in milliseconds
	
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly emailService: EmailService,
	) {}
	
	async registerUser(userData: Omit<UserProps, 'id'>): Promise<{ user: AuthUser; token: string }> {
		const existingUser = await this.authRepository.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("User already exists");
		}
		
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const confirmation_token = uuidv4();
		const confirmation_expires_at = new Date(Date.now() + this.emailVerificationExpirationTime);
		
		const user = new AuthUser({
			...userData,
			password: hashedPassword,
			confirmation_token,
			confirmation_expires_at,
		});
		
		const createdUser = await this.authRepository.registerUser(user);
		const token = this.generateToken(createdUser);
		
		await this.emailService.sendEmailConfirmationEmail(userData.email, confirmation_token);
		
		return { user: createdUser, token };
	}
	
	async loginUser(email: string, password: string): Promise<LoginResponse> {
		const user = await this.authRepository.findByEmail(email);
		if (!user) {
			throw new Error("User not found");
		}
		
		const isPasswordCorrect = await bcrypt.compare(password, user.getPassword());
		if (!isPasswordCorrect) {
			throw new Error("Incorrect password");
		}
		
		const token = this.generateToken(user);
		let status: LoginResponse["status"] = "SUCCESS";
		
		if (!user.isEmailVerified() && user.getRole() != 'driver') {
			status = "REQUIRED_EMAIL_VERIFICATION";
		} else if (user.requieresNewPassword()) {
			status = "INCORRECT_PASSWORD";
		}
		
		return { user, token, status };
	}
	
	async forgotPassword(): Promise<void> {
		console.log("AuthService.forgotPassword()");
	}
	
	async resetPassword(): Promise<void> {
		console.log("AuthService.resetPassword()");
	}
	
	async changePassword(): Promise<void> {
		console.log("AuthService.changePassword()");
	}
	
	async confirmEmail(token: string): Promise<void> {
		const user = await this.authRepository.findByConfirmationToken(token);
		if (!user) {
			throw new Error("User not found");
		}
		
		const confirmationExpirationTime = user.getConfirmationExpires();
		if (!confirmationExpirationTime || new Date() > confirmationExpirationTime) {
			throw new Error("Confirmation token expired");
		}
		
		user.setEmailVerified(true);
		await this.authRepository.updateUser(user);
	}
	
	async setInitialPassword(): Promise<void> {
		console.log("AuthService.setInitialPassword()");
	}
	
	private generateToken(user: AuthUser): string {
		const secret = process.env.JWT_SECRET || "secret";
		
		const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
		
		return jwt.sign(
			{ id: user.getId(), email: user.getEmail() },
			secret,
			{
				expiresIn,
			}
		);
	}
}