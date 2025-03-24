import { Router } from "express";

const shipmentRoutes = Router();

shipmentRoutes.get('/', (req, res) => {
	res.send('Hello World');
});

export default shipmentRoutes;