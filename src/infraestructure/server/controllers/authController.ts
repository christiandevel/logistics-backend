import { AuthService } from "@/application/services/authServices";
import { ValidationError } from "../../validation/middleware/validationMiddleware";
import { Request, Response } from "express";

export class AuthController {
	constructor(private readonly authService: AuthService) {}
	
	registerUser = async (req: Request, res: Response): Promise<void> => {
		try {
			await this.authService.registerUser(req.body);
			res.status(200).json({
				status: "success",
				message: "User created successfully",
			});
		} catch (error) {
			if (error instanceof ValidationError) {
				res.status(400).json({
					status: "error",
					message: "Validation error",
					error: error.message,
				});
			} else {
				res.status(500).json({
					status: "error",
					message: "Internal server error",
					error: error.message,
				});
			}
		}
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