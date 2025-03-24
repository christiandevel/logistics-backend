import { EmailSenser, EmailTemplate } from "@/domain/ports/EmailSender";
import nodemailer from "nodemailer";

export class NodemailerEmailSender implements EmailSenser {
	private readonly transporter: nodemailer.transporter;
	
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: Number(process.env.EMAIL_PORT),
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}
	
	async sendEmail(email: EmailTemplate): Promise<void> {
		const { to, subject, html } = email;
		
		await this.transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to,
			subject,
			html,
		});
	}
}