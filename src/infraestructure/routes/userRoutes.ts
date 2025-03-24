import { Router } from "express";

const userRoutes = Router();


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Get all users from the database
 */
userRoutes.get('/', (req, res) => {
	res.send('Hello World');
});

export default userRoutes;