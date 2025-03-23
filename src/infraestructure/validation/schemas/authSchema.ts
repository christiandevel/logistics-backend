import Joi from "joi";

export const registerSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"any.required": "Email is required",
		"string.email": "Email is not valid",
	}),
	password: Joi.string().required().min(8).messages({
		"any.required": "Password is required",
		"string.min": "Password must be at least 8 characters",
	}),
	full_name: Joi.string().required().messages({
		"any.required": "Full name is required",
	}),
	role: Joi.string().required().valid("admin", "user", "driver").messages({
		"any.required": "Role is required",
		"string.valid": "Role must be one of the following: admin, user, driver",
	})
});