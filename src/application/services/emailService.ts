import { EmailSenser } from "@/domain/ports/EmailSender";

export class EmailService {
	constructor(private readonly emailSender: EmailSenser) {}
	
	async sendPasswordResetEmail(to: string, token: string): Promise<void> {
		const resetURL = `${process.env.API_URL}/reset-password?token=${token}`;
		const html = `
			<h1>Recuperación de contraseña</h1>
			<p>Has solicitado restablecer tu contraseña. Para hacerlo, haz clic en el siguiente enlace para continuar:</p>
			<a href="${resetURL}">Restablecer contraseña</a>
			<p>Este enlace expirará en 1 hora.</p>
			<p>Si no has solicitado esto, puedes ignorar este correo.</p>
		`;
		
		await this.emailSender.sendEmail({ to, subject: "Recuperación de contraseña", html });
	}
	
	async sendEmailConfirmationEmail(to: string, token: string): Promise<void> {
		const confirmURL = `${process.env.API_URL}/confirm-email?token=${token}`;
		const html = `
			<h1>Confirmación de correo electrónico</h1>
			<p>Para completar tu registro, haz clic en el siguiente enlace para continuar:</p>
			<a href="${confirmURL}">Confirmar correo electrónico</a>
			<p>Este enlace expirará en 1 hora.</p>
			<p>Si no has solicitado esto, puedes ignorar este correo.</p>
		`;
		
		await this.emailSender.sendEmail({ to, subject: "Confirmación de correo electrónico", html });
	}
}