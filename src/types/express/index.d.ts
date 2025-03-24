import { AuthUser } from "../../domain/entities/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 