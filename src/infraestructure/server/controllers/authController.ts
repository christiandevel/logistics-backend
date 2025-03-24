import { Request, Response } from "express";
import { AuthService } from "@/application/services/authServices";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, full_name, role } = req.body;
      const result = await this.authService.registerUser({ email, password, full_name, role });

      res.status(201).json({
        message: "User created successfully",
        token: result.token,
        user: {
          id: result.user.getId(),
          email: result.user.getEmail(),
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginUser(email, password);
      
      const response = {
        message: "User logged in successfully",
        user: {
          id: result.user.getId(),
          email: result.user.getEmail(),
          role: result.user.getRole(),
          isVerified: result.user.isEmailVerified(),
        },
        status: result.status,
        token: result.token,
      };
      
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      
      res.status(200).json({ 
        message: "If the email exists, password reset instructions have been sent",
        userExists: result.userExists
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);
      
      res.status(200).json({ 
        message: "Password has been reset successfully",
        status: "SUCCESS"
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ 
          message: error.message,
          status: "ERROR"
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error",
          status: "ERROR"
        });
      }
    }
  }

  confirmEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      await this.authService.confirmEmail(token);
      
      res.status(200).json({ 
        message: "Email confirmed successfully",
        status: "SUCCESS"
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ 
          message: error.message,
          status: "ERROR"
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error",
          status: "ERROR"
        });
      }
    }
  }

  setInitialPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      await this.authService.setInitialPassword(userId, currentPassword, newPassword);
      
      res.status(200).json({ 
        message: "Password has been set successfully",
        status: "SUCCESS"
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ 
          message: error.message,
          status: "ERROR"
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error",
          status: "ERROR"
        });
      }
    }
  }
}
