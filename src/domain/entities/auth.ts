export type UserRole = "admin" | "user" | "driver";

export interface UserProps {
	id?: string;
	email: string;
	password: string;
	full_name: string;
	role?: UserRole;
	email_verified?: boolean;
	requires_password_change?: boolean;
}

export class AuthUser {
	private readonly id?: string;
	private email: string;
	private password: string;
	private full_name: string;
	private role: UserRole;
	private email_verified?: boolean;
	private requires_password_change?: boolean;
	
	constructor(props: UserProps) {
		this.id = props.id;
		this.email = props.email;
		this.password = props.password;
		this.full_name = props.full_name;
		this.role = props.role;
		this.email_verified = props.email_verified;
		this.requires_password_change = props.requires_password_change;
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
	
	setEmailVerified(emailVerified: boolean): void {
		this.email_verified = emailVerified;
	}
	
	setRequiresPasswordChange(requiresPasswordChange: boolean): void {
		this.requires_password_change = requiresPasswordChange;
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