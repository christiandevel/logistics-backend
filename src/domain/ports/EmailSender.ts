export interface EmailTemplate {
	to: string;
	subject: string;
	html: string;
}

export interface EmailSenser {
	sendEmail(email: EmailTemplate): Promise<void>;
}