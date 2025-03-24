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
	
	async forgotPassword(email: string, resetToken: string, resetExpires: Date): Promise<void> {

		const query = `
			UPDATE users
			SET reset_password_token = $1,
				reset_password_expires_at = $2 AT TIME ZONE 'UTC'
			WHERE email = $3
			RETURNING id, email, reset_password_token, reset_password_expires_at;
		`
		
		await this.pool.query(query, [resetToken, resetExpires, email]);
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
		const { email, password, full_name, role, confirmation_token, confirmation_expires_at, email_verified } = user.toJSON();
		
		const query = `
			UPDATE users
			SET email = $1, 
				password = $2, 
				full_name = $3, 
				role = $4, 
				confirmation_token = $5, 
				confirmation_expires_at = $6,
				email_verified = $7
			WHERE id = $8;
		`
		
		await this.pool.query(query, [
			email, 
			password, 
			full_name, 
			role, 
			confirmation_token, 
			confirmation_expires_at,
			email_verified,
			user.getId()
		]);
	}
	
	async setInitialPassword(): Promise<void> {
		console.log("PostgresAuthRepository.setInitialPassword()");
	}
	
	async findByResetToken(token: string): Promise<AuthUser | null> {
		// Primero verificamos el estado actual del token
		const checkQuery = `
			SELECT id, email, reset_password_token, reset_password_expires_at, 
				   NOW() as current_time,
				   CASE 
					   WHEN reset_password_expires_at > NOW() THEN true 
					   ELSE false 
				   END as is_valid
			FROM users 
			WHERE reset_password_token = $1;
		`;
		const checkResult = await this.pool.query(checkQuery, [token]);
		console.log('Token check:', {
			found: checkResult.rows.length > 0,
			tokenData: checkResult.rows[0],
			currentTime: new Date().toISOString()
		});

		const query = `
			SELECT * FROM users 
			WHERE reset_password_token = $1 
			AND reset_password_expires_at AT TIME ZONE 'UTC' > NOW() AT TIME ZONE 'UTC';
		`
		
		const result = await this.pool.query(query, [token]);
		console.log('Final query result:', {
			found: result.rows.length > 0,
			tokenValid: result.rows.length > 0 ? 'yes' : 'no',
			query: query.replace(/\s+/g, ' ').trim()
		});
		
		if (result.rows.length === 0) {
			return null;
		}
		
		const userData = this.mapRowToAuthUser(result.rows[0]);
		return new AuthUser(userData);
	}
	
	async resetPassword(userId: string, newPassword: string): Promise<void> {
		const query = `
			UPDATE users
			SET password = $1,
				reset_password_token = NULL,
				reset_password_expires_at = NULL,
				requires_password_change = false
			WHERE id = $2
			RETURNING *;
		`
		
		const result = await this.pool.query(query, [newPassword, userId]);
		console.log('Password reset complete for user:', result.rows[0]);
	}
	
	private mapRowToAuthUser(row: any): UserProps {
		return { 
			id: row.id,
			email: row.email,
			password: row.password,
			full_name: row.full_name,
			role: row.role,
			email_verified: row.email_verified,
			confirmation_token: row.confirmation_token,
			confirmation_expires_at: row.confirmation_expires_at,
			requires_password_change: row.requires_password_change,
			reset_password_token: row.reset_password_token,
			reset_password_expires_at: row.reset_password_expires_at
		}
	}
}