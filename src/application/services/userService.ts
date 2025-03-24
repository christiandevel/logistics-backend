import { AuthUser }  from "../../domain/entities/auth";
import { UserRepository } from "@/domain/ports/UserRepository";

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findAll(): Promise<AuthUser[]> {
		return this.userRepository.findAll();
	}
	
	async findByRole(role: string): Promise<AuthUser[]> {
		return this.userRepository.findByRole(role);
	}
}