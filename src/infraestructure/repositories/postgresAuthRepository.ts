import { AuthUser, UserProps } from "../../domain/entities/auth";
import { AuthRepository } from "@/domain/ports/AuthRepository";
import { Pool } from "pg";

export class PostgresAuthRepository implements AuthRepository {
	
	constructor(private readonly pool: Pool) {}
	
	async registerUser(user: AuthUser): Promise<AuthUser> {
		const { email, password, full_name, role, confirmation_token, confirmation_expires_at } = user.toJSON();
		
		const query = `
			INSERT INTO users (email, password, full_name, role, confirmation_token, confirmation_expires_at)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING *;
		`
		
		const result = await this.pool.query(query, [email, password, full_name, role, confirmation_token, confirmation_expires_at]);
		const userData = this.mapRowToAuthUser(result.rows[0]);
		return new AuthUser(userData);
	}
	
	async findByEmail(email: string): Promise<AuthUser | null> {
		const query = `
			SELECT * FROM users WHERE email = $1;
		`
		
		const result = await this.pool.query(query, [email]);
		if (result.rows.length === 0) {
			return null;
		}
		
		const userData = this.mapRowToAuthUser(result.rows[0]);
		return new AuthUser(userData);
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
	
	async findByConfirmationToken(token: string): Promise<AuthUser | null> {
		const query = `
			SELECT * FROM users WHERE confirmation_token = $1;
		`
		
		const result = await this.pool.query(query, [token]);
		if (result.rows.length === 0) {
			return null;
		}
		
		const userData = this.mapRowToAuthUser(result.rows[0]);
		return new AuthUser(userData);
	}
	
	async updateUser(user: AuthUser): Promise<void> {
		const { email, password, full_name, role, confirmation_token, confirmation_expires_at } = user.toJSON();
		
		const query = `
			UPDATE users
			SET email = $1, 
				password = $2, 
				full_name = $3, 
				role = $4, 
				confirmation_token = $5, 
				confirmation_expires_at = $6
			WHERE id = $7;
		`
		
		await this.pool.query(query, [
			email, 
			password, 
			full_name, 
			role, 
			confirmation_token, 
			confirmation_expires_at, 
			user.getId()
		]);
	}
	
	async setInitialPassword(): Promise<void> {
		console.log("PostgresAuthRepository.setInitialPassword()");
	}
	
	private mapRowToAuthUser(row: any): UserProps {
		return { 
			id: row.id,
			email: row.email,
			password: row.password,
			full_name: row.full_name,
			role: row.role,
			email_verified: row.email_verified,
			requires_password_change: row.requires_password_change,
			confirmation_token: row.confirmation_token,
			confirmation_expires_at: row.confirmation_expires_at,
		}
	}
}