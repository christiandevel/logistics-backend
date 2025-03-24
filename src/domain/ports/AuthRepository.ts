import { AuthUser } from "../entities/auth";

export interface AuthRepository {	
	registerUser(user: AuthUser): Promise<AuthUser>;
	findByEmail(email: string): Promise<AuthUser | null>;
	loginUser(): Promise<void>;
	forgotPassword(): Promise<void>;
	resetPassword(): Promise<void>;
	changePassword(): Promise<void>;
	confirmEmail(): Promise<void>;
	setInitialPassword(): Promise<void>;
}