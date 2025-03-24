import { Request, Response } from "express";
import { UserService } from "../../../application/services/userService";

export class UserController {
	constructor(private readonly userService: UserService) {}

	findAll = async (req: Request, res: Response): Promise<void> => {
		try {
			const users = await this.userService.findAll();
			res.json(users);
		} catch (error) {
			res.status(500).json({ message: 'Error retrieving users', status: 'ERROR' });
		}
	}
	
	findByRole = async (req: Request, res: Response): Promise<void> => {
		try {
			const { role } = req.params;
			const users = await this.userService.findByRole(role);
			res.json(users);
		} catch (error) {
			res.status(500).json({ message: 'Error retrieving users', status: 'ERROR' });
		}
	}
}