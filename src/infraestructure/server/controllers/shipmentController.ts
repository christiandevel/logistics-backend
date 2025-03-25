import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

import { ShipmentService } from "../../../application/services/shipmentService";

export class ShipmentController {
	constructor(private readonly shipmentService: ShipmentService) { }

	createShipment = async (req: Request, res: Response): Promise<void> => {
		try {
			
			const userId = req.user.id
			const trakingNumber = `SHIP-${uuidv4().split('-')[0].toUpperCase()}`
			
			const estimatedDeliveryDate = new Date()
			estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7)
			
			const shipment = await this.shipmentService.createShipment({
				userId,
				trakingNumber,
				estimatedDeliveryDate,
				...req.body
			});
			res.status(201).json(shipment);
		} catch (error) {
			res.status(500).json({ message: 'Error creating shipment', status: error });
		}
	}

	findAllShipments = async (req: Request, res: Response): Promise<void> => {
		try {
			const status = req.query.status as string | undefined;
			const shipments = await this.shipmentService.findAllShipments(status);
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

	getDriverShipments = async (req: Request, res: Response): Promise<void> => {
		try {
			const driverId = req.user?.id;
			
			if (!driverId) {
				res.status(401).json({ message: 'User not authenticated' });
			}
			
			const shipments = await this.shipmentService.findShipmentsByDriverId(driverId.toString());
			res.json(shipments);
		} catch (error) {
			console.error('Error getting driver shipments:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	getDetailedReports = async (req: Request, res: Response): Promise<void> => {
		console.log('getDetailedReports');
		try {
			const { startDate, endDate, status } = req.query;
			
			// Validate date formats if provided
			let parsedStartDate: Date | undefined;
			let parsedEndDate: Date | undefined;
			
			if (startDate) {
				parsedStartDate = new Date(startDate as string);
				if (isNaN(parsedStartDate.getTime())) {
					throw new Error('Invalid start date format. Use YYYY-MM-DD');
				}
			}
			
			if (endDate) {
				parsedEndDate = new Date(endDate as string);
				if (isNaN(parsedEndDate.getTime())) {
					throw new Error('Invalid end date format. Use YYYY-MM-DD');
				}
			}
			
			// Validate status if provided
			if (status && !['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(status as string)) {
				throw new Error('Invalid status. Must be one of: PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED');
			}
			
			const reports = await this.shipmentService.getDetailedReports(
				parsedStartDate,
				parsedEndDate,
				status as string | undefined
			);
			
			res.json({
				success: true,
				data: reports
			});
		} catch (error) {
			console.error('Error getting detailed reports:', error);
			res.status(500).json({ 
				success: false,
				message: error instanceof Error ? error.message : 'Error retrieving detailed reports',
				status: 'ERROR' 
			});
		}
	}

	getShipmentStatistics = async (req: Request, res: Response): Promise<void> => {
		try {
			const { startDate, endDate } = req.query;
			
			// Validate date formats if provided
			let parsedStartDate: Date | undefined;
			let parsedEndDate: Date | undefined;
			
			if (startDate) {
				parsedStartDate = new Date(startDate as string);
				if (isNaN(parsedStartDate.getTime())) {
					throw new Error('Invalid start date format. Use YYYY-MM-DD');
				}
			}
			
			if (endDate) {
				parsedEndDate = new Date(endDate as string);
				if (isNaN(parsedEndDate.getTime())) {
					throw new Error('Invalid end date format. Use YYYY-MM-DD');
				}
			}
			
			const statistics = await this.shipmentService.getShipmentStatistics(
				parsedStartDate,
				parsedEndDate
			);
			
			res.json({
				success: true,
				data: statistics
			});
		} catch (error) {
			console.error('Error getting shipment statistics:', error);
			res.status(500).json({ 
				success: false,
				message: error instanceof Error ? error.message : 'Error retrieving shipment statistics',
				status: 'ERROR' 
			});
		}
	}
}