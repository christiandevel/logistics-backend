import { AuthUser, UserProps } from "../entities/auth";

export interface UserRepository {
	findAll(): Promise<AuthUser[]>;
	findByRole(role: string): Promise<AuthUser[]>;
}