import { AuthRepository } from "@/domain/ports/AuthRepository";

export class AuthService {
	constructor(private readonly authRepository: AuthRepository) {}
	
	async registerUser(user: any): Promise<void> {
		console.log("AuthService.registerUser()");
	}
	
	async loginUser(): Promise<void> {
		console.log("AuthService.loginUser()");
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
}