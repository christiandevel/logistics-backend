import { Router } from "express";
import pool from "../config/database";
import { PostgresShipmentRepository } from "../repositories/postgresShipmentRepository";
import { ShipmentService } from "../../application/services/shipmentService";
import { ShipmentController } from "../server/controllers/shipmentController";

const shipmentRoutes = Router();

const shipmentRepository = new PostgresShipmentRepository(pool);
const shipmentService = new ShipmentService(shipmentRepository);
const shipmentController = new ShipmentController(shipmentService);

shipmentRoutes.post('/', shipmentController.createShipment);
shipmentRoutes.get('/', shipmentController.findAllShipments);
shipmentRoutes.get('/:id', shipmentController.findShipmentById);
shipmentRoutes.get('/user/:userId', shipmentController.findShipmentsByUserId);
shipmentRoutes.put('/:id/status', shipmentController.changeShipmentStatus);
shipmentRoutes.put('/:id/driver', shipmentController.changeShipmentDriver);
shipmentRoutes.get('/:id/history', shipmentController.getShipmentHistory);

export default shipmentRoutes;