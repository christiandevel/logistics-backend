import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthUser } from "@/domain/entities/auth";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (user: AuthUser): string => {
  const secret = process.env.JWT_SECRET || "secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  
  return jwt.sign(
    { id: user.getId(), role: user.getRole(), isVerified: user.isEmailVerified() },
    secret,
    { expiresIn }
  );
};

export const TOKEN_EXPIRATION = {
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour in milliseconds
}; 