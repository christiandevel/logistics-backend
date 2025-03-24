import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "@/domain/entities/auth";

declare global {
	namespace Express {
		interface Request {
			user?: { id: string; role: UserRole; isVerified: boolean };
		}
	}
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		
		if (!token) {
			res.status(401).json({ message: "No token provided" });
			return;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token" });
	}
};
