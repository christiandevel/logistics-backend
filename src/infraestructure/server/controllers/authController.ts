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

  async forgotPassword(): Promise<void> {
    console.log("AuthController.forgotPassword()");
  }

  async resetPassword(): Promise<void> {
    console.log("AuthController.resetPassword()");
  }

  async changePassword(): Promise<void> {
    console.log("AuthController.changePassword()");
  }

  async confirmEmail(): Promise<void> {
    console.log("AuthController.confirmEmail()");
  }

  async setInitialPassword(): Promise<void> {
    console.log("AuthController.setInitialPassword()");
  }
}
