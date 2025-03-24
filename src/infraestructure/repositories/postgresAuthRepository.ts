import { AuthUser, UserProps } from "../../domain/entities/auth";
import { AuthRepository } from "@/domain/ports/AuthRepository";
import { Pool } from "pg";

export class PostgresAuthRepository implements AuthRepository {
	
	constructor(private readonly pool: Pool) {}
	
	async registerUser(user: AuthUser): Promise<AuthUser> {
		const { email, password, full_name, role } = user.toJSON();
		
		const query = `
			INSERT INTO users (email, password, full_name, role)
			VALUES ($1, $2, $3, $4)
			RETURNING *;
		`
		
		const result = await this.pool.query(query, [email, password, full_name, role]);
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
		}
	}
}