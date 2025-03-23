import { Request, Response, NextFunction } from "express";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const ValidateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { error, value } = schema.validate(req.body, {
				abortEarly: false,
				stripUnknown: true,
			});
	
			if (error) {
				const details = error.details.map((detail) => ({
					field: detail.path.join("."),
					message: detail.message,
				}));
	
				res.status(400).json({
					status: "error",
					message: "Validation error",
					error: details,
				});
				
				return
			}
			
			req.body = value;
			next();
		} catch (error) {
			next(error);
		}
  };
};
