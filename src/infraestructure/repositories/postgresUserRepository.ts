import { AuthUser } from "../../domain/entities/auth";
import { UserRepository } from "@/domain/ports/UserRepository";
import { Pool } from "pg";

export class PostgresUserRepository implements UserRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(): Promise<AuthUser[]> {
		const result = await this.pool.query("SELECT * FROM users");
		return result.rows.map((row) => new AuthUser(row));
	}

	async findByRole(role: string): Promise<AuthUser[]> {
		const result = await this.pool.query("SELECT * FROM users WHERE role = $1", [role]);
		return result.rows.map((row) => new AuthUser(row));
	}
}
