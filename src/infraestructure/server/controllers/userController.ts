import { Request, Response } from "express";
import { UserService } from "../../../application/services/userService";

export class UserController {
	constructor(private readonly userService: UserService) {}

	findAll = async (req: Request, res: Response): Promise<void> => {
		const users = await this.userService.findAll();
		
		if (users.length === 0) {
			res.status(404).json({ message: "No users found" });
			return;
		}
		
		res.status(200).json(users);
	}
	
	findByRole = async (req: Request, res: Response): Promise<void> => {
		const role = req.params.role;
		const users = await this.userService.findByRole(role);
		
		if (users.length === 0) {
			res.status(404).json({ message: "No users found" });
			return;
		}
		
		res.status(200).json(users);
	}
}