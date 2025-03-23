import { AuthRepository } from "@/domain/ports/AuthRepository";
import { Pool } from "pg";

export class PostgresAuthRepository implements AuthRepository {
	
	constructor(private readonly pool: Pool) {}
	
	async registerUser(): Promise<void> {
		console.log("PostgresAuthRepository.registerUser()");
	}
	
	async loginUser(): Promise<void> {
		console.log("PostgresAuthRepository.loginUser()");
	}
	
	async forgotPassword(): Promise<void> {
		console.log("PostgresAuthRepository.forgotPassword()");
	}
	
	async resetPassword(): Promise<void> {
		console.log("PostgresAuthRepository.resetPassword()");
	}
	
	async changePassword(): Promise<void> {
		console.log("PostgresAuthRepository.changePassword()");
	}
	
	async confirmEmail(): Promise<void> {
		console.log("PostgresAuthRepository.confirmEmail()");
	}
	
	async setInitialPassword(): Promise<void> {
		console.log("PostgresAuthRepository.setInitialPassword()");
	}
}