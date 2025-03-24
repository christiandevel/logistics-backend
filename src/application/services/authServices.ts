import { AuthUser, UserProps } from "../../domain/entities/auth";
import { AuthRepository } from "../../domain/ports/AuthRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailService } from "./emailService";

export type LoginResponse = {
	user: AuthUser;
	token: string;
	status: "SUCCESS" | "REQUIRED_EMAIL_VERIFICATION" | "INCORRECT_PASSWORD";
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
		
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const user = new AuthUser({
			...userData,
			password: hashedPassword,
		});
		
		const createdUser = await this.authRepository.registerUser(user);
		const token = this.generateToken(createdUser);
		
		await this.emailService.sendEmailConfirmationEmail(userData.email, token);
		
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
		} else if (!user.getRequiresPasswordChange()) {
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
	
	async confirmEmail(): Promise<void> {
		console.log("AuthService.confirmEmail()");
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