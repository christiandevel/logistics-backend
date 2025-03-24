export type UserRole = "admin" | "user" | "driver";

export interface UserProps {
	id?: string;
	email: string;
	password: string;
	full_name: string;
	role?: UserRole;
	email_verified?: boolean;
	requires_password_change?: boolean;
	confirmation_token?: string;
	confirmation_expires_at?: Date;
}

export class AuthUser {
	private readonly id?: string;
	private email: string;
	private password: string;
	private full_name: string;
	private role: UserRole;
	private email_verified?: boolean;
	private requires_password_change?: boolean;
	private confirmation_token?: string;
	private confirmation_expires_at?: Date;
	
	constructor(props: UserProps) {
		this.id = props.id;
		this.email = props.email;
		this.password = props.password;
		this.full_name = props.full_name;
		this.role = props.role;
		this.email_verified = props.email_verified;
		this.requires_password_change = props.requires_password_change;
		this.confirmation_token = props.confirmation_token;
		this.confirmation_expires_at = props.confirmation_expires_at;
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
	
	isEmailVerified(): boolean {
		return this.email_verified;
	}
	
	requieresNewPassword(): boolean {
		return this.requires_password_change;
	}
	
	setEmailVerified(emailVerified: boolean): void {
		this.email_verified = emailVerified;
	}
	
	getRequiresPasswordChange(): boolean {
		return this.requires_password_change;
	}
	
	setRequiresPasswordChange(requiresPasswordChange: boolean): void {
		this.requires_password_change = requiresPasswordChange;
	}
	
	getConfirmationExpires(): Date | undefined {
		return this.confirmation_expires_at;
	}
	
	public toJSON(): UserProps {
		return {
			id: this.id,
			email: this.email,
			password: this.password,
			full_name: this.full_name,
			role: this.role,
			email_verified: this.email_verified,
			requires_password_change: this.requires_password_change,
			confirmation_token: this.confirmation_token,
			confirmation_expires_at: this.confirmation_expires_at,
		};
	}
}