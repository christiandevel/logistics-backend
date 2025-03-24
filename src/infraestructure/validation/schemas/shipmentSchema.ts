import Joi from "joi";

export const createShipmentSchema = Joi.object({
	origin: Joi.string()
		.required()
		.min(5)
		.max(255)
		.messages({
			'string.empty': 'Origin is required',
			'string.min': 'Origin must be at least 5 characters long',
			'string.max': 'Origin must be less than 255 characters long'
		}),
	destination: Joi.string()
		.required()
		.min(5)
		.max(255)
		.messages({
			'string.empty': 'Destination is required',
			'string.min': 'Destination must be at least 5 characters long',
			'string.max': 'Destination must be less than 255 characters long'
		}),
	destinationZipcode: Joi.string()
		.required()
		.pattern(/^[0-9]{5}(-[0-9]{4})?$/)
		.messages({
			'string.empty': 'Destination zipcode is required',
			'string.pattern.base': 'Invalid zipcode format'
		}),
	destinationCity: Joi.string()
		.required()
		.min(3)
		.max(255)
		.messages({
			'string.empty': 'Destination city is required',
			'string.min': 'Destination city must be at least 3 characters long',
			'string.max': 'Destination city must be less than 255 characters long'
		}),
	weight: Joi.number()
		.required()
		.positive()
		.max(100)
		.messages({
			'number.base': 'Weight must be a number',
			'number.positive': 'Weight must be positive',
			'number.max': 'Weight must be less than 100 kg'
		}),
	width: Joi.number()
		.required()
		.positive()
		.max(100)
		.messages({
			'number.base': 'Width must be a number',
			'number.positive': 'Width must be positive',
			'number.max': 'Width must be less than 100 cm'
		}),
	height: Joi.number()
		.required()
		.positive()
		.max(100)
		.messages({
			'number.base': 'Height must be a number',
			'number.positive': 'Height must be positive',
			'number.max': 'Height must be less than 100 cm'
		}),
	length: Joi.number()
		.required()
		.positive()
		.max(100)
		.messages({
			'number.base': 'Length must be a number',
			'number.positive': 'Length must be positive',
			'number.max': 'Length must be less than 100 cm'
		}),
	productType: Joi.string()
		.required()
		.valid('electronic', 'food', 'medicine', 'other')
		.messages({
			'string.empty': 'Product type is required',
			'string.valid': 'Invalid product type'
		}),
	isFragile: Joi.boolean()
		.default(false),
	specialInstructions: Joi.string()
		.optional()
		.max(255)
		.messages({
			'string.max': 'Special instructions must be less than 255 characters long'
		})
})