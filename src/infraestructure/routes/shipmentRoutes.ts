import { Router } from "express";
import pool from "../config/database";
import { PostgresShipmentRepository } from "../repositories/postgresShipmentRepository";
import { ShipmentService } from "../../application/services/shipmentService";
import { ShipmentController } from "../server/controllers/shipmentController";

const shipmentRoutes = Router();

const shipmentRepository = new PostgresShipmentRepository(pool);
const shipmentService = new ShipmentService(shipmentRepository);
const shipmentController = new ShipmentController(shipmentService);

export default shipmentRoutes;