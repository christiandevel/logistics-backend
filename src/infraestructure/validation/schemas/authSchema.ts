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

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"any.required": "Email is required",
		"string.email": "Email is not valid",
	}),
	password: Joi.string().required().min(8).messages({
		"any.required": "Password is required",
		"string.min": "Password must be at least 8 characters",
	}),
});

export const verifyEmailSchema = Joi.object({
	token: Joi.string().required().guid({ version: "uuidv4" }).messages({
		"any.required": "Token is required",
		"string.guid": "Token is not valid",
	}),
})

export const forgotPasswordSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"any.required": "Email is required",
		"string.email": "Email is not valid",
	}),
});

export const resetPasswordSchema = Joi.object({
	token: Joi.string().required().guid({ version: "uuidv4" }).messages({
		"any.required": "Token is required",
		"string.guid": "Token is not valid",
	}),
	password: Joi.string().required().min(8).messages({
		"any.required": "Password is required",
		"string.min": "Password must be at least 8 characters",
	}),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		"any.required": "Password confirmation is required",
		"any.only": "Passwords do not match",
	}),
});