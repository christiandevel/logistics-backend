import { NodemailerEmailSender } from "./nodemailerEmailSender";

export type EmailType = "nodemailer" | "sender";

export class EmailSenderFactory {
	static create(emailType: EmailType) {
		switch (emailType) {
			case "nodemailer":
				return new NodemailerEmailSender();
			case "sender":
				// Future Implementation
				throw new Error("Sender is not supported yet");
			default:
				throw new Error(`Email type ${emailType} not supported`);
		}
	}
}