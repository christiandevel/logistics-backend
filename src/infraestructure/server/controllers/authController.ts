import { AuthService } from "@/application/services/authServices";

export class AuthController {
	constructor(private readonly authService: AuthService) {}
	
	async registerUser(): Promise<void> {
		console.log("AuthController.registerUser()");
	}
	
	async loginUser(): Promise<void> {
		console.log("AuthController.loginUser()");
	}
	
	async forgotPassword(): Promise<void> {
		console.log("AuthController.forgotPassword()");
	}
	
	async resetPassword(): Promise<void> {
		console.log("AuthController.resetPassword()");
	}
	
	async changePassword(): Promise<void> {
		console.log("AuthController.changePassword()");
	}
	
	async confirmEmail(): Promise<void> {
		console.log("AuthController.confirmEmail()");
	}
	
	async setInitialPassword(): Promise<void> {
		console.log("AuthController.setInitialPassword()");
	}
}