export interface UserProps {
	id?: string;
	email: string;
	password: string;
	full_name: string;
	role: "admin" | "user" | "driver";
}

export class AuthUser {
	private readonly id?: string;
	private email: string;
	private password: string;
	private full_name: string;
	private role: "admin" | "user" | "driver";
	
	constructor(props: UserProps) {
		this.id = props.id;
		this.email = props.email;
		this.password = props.password;
		this.full_name = props.full_name;
		this.role = props.role;
	}
	
	getId(): string | undefined {
		return this.id;
	}
	
	getEmail(): string {
		return this.email;
	}
	
	getPassword(): string {
		return this.password;
	}
	
	getFullName(): string {
		return this.full_name;
	}
	
	getRole(): "admin" | "user" | "driver" {
		return this.role;
	}	
	
	setPassword(password: string): void {
		this.password = password;
	}
	
	public toJSON(): UserProps {
		return {
			id: this.id,
			email: this.email,
			password: this.password,
			full_name: this.full_name,
			role: this.role,
		};
	}
}