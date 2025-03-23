export interface AuthRepository {	
	registerUser(): Promise<void>;
	loginUser(): Promise<void>;
	forgotPassword(): Promise<void>;
	resetPassword(): Promise<void>;
	changePassword(): Promise<void>;
	confirmEmail(): Promise<void>;
	setInitialPassword(): Promise<void>;
}