import { AuthUser } from "../entities/auth";

export interface AuthRepository {	
	registerUser(user: AuthUser): Promise<AuthUser>;
	findByEmail(email: string): Promise<AuthUser | null>;
	updateUser(user: AuthUser): Promise<void>;
	loginUser(): Promise<void>;
	forgotPassword(): Promise<void>;
	resetPassword(): Promise<void>;
	changePassword(): Promise<void>;
	confirmEmail(): Promise<void>;
	findByConfirmationToken(token: string): Promise<AuthUser | null>;
	setInitialPassword(): Promise<void>;
}