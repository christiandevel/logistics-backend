import { AuthUser } from "../entities/auth";

export interface AuthRepository {	
	registerUser(user: AuthUser): Promise<AuthUser>;
	findByEmail(email: string): Promise<AuthUser | null>;
	updateUser(user: AuthUser): Promise<void>;
	loginUser(): Promise<void>;
	forgotPassword(email: string, resetToken: string, resetExpires: Date): Promise<void>;
	findByResetToken(token: string): Promise<AuthUser | null>;
	resetPassword(userId: string, newPassword: string): Promise<void>;
	confirmEmail(): Promise<void>;
	findByConfirmationToken(token: string): Promise<AuthUser | null>;
	setInitialPassword(): Promise<void>;
}