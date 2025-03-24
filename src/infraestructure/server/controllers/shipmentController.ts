import { Request, Response } from "express";
import { ShipmentService } from "../../../application/services/shipmentService";

export class ShipmentController {
	constructor(private readonly shipmentService: ShipmentService) { }

	createShipment = async (req: Request, res: Response): Promise<void> => {
		try {
			const shipment = await this.shipmentService.createShipment(req.body);
			res.status(201).json(shipment);
		} catch (error) {
			res.status(500).json({ message: 'Error creating shipment', status: 'ERROR' });
		}
	}

	findAllShipments = async (req: Request, res: Response): Promise<void> => {
		try {
			const shipments = await this.shipmentService.findAllShipments();
			res.json(shipments);
		} catch (error) {
			res.status(500).json({ message: 'Error retrieving shipments', status: 'ERROR' });
		}
	}

	findShipmentById = async (req: Request, res: Response): Promise<void> => {
		try {
			const shipment = await this.shipmentService.findShipmentById(req.params.id);
			res.json(shipment);
		} catch (error) {
			res.status(500).json({ message: 'Error retrieving shipment', status: 'ERROR' });
		}
	}

	findShipmentsByUserId = async (req: Request, res: Response): Promise<void> => {
		try {
			const shipments = await this.shipmentService.findShipmentsByUserId(req.params.userId);
			res.json(shipments);
		} catch (error) {
			res.status(500).json({ message: 'Error retrieving shipments', status: 'ERROR' });
		}
	}

	changeShipmentStatus = async (req: Request, res: Response): Promise<void> => {
		try {
			const shipment = await this.shipmentService.changeShipmentStatus(req.params.id, req.body.status);
			res.json(shipment);
		} catch (error) {
			res.status(500).json({ message: 'Error changing shipment status', status: 'ERROR' });
		}
	}

	changeShipmentDriver = async (req: Request, res: Response): Promise<void> => {
		try {
			const shipment = await this.shipmentService.changeShipmentDriver(req.params.id, req.body.driverId);
			res.json(shipment);
		} catch (error) {
			res.status(500).json({ message: 'Error changing shipment driver', status: 'ERROR' });
		}
	}

	getShipmentHistory = async (req: Request, res: Response): Promise<void> => {
		try {
			const history = await this.shipmentService.getShipmentHistory(req.params.id);
			res.json(history);
		} catch (error) {
			res.status(500).json({ message: 'Error retrieving shipment history', status: 'ERROR' });
		}
	}
}