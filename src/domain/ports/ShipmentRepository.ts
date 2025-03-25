import { Shipment, ShipmentHistory, ShipmentStatus } from "../entities/shipment";
import { ShipmentReport, ShipmentStatistics } from "../../infraestructure/repositories/postgresShipmentRepository";

export interface ShipmentRepository {
	create(shipment: Omit<Shipment, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Shipment>;
	findAll(status?: string): Promise<Shipment[]>;
	findById(id: string): Promise<Shipment>;
	findByUserId(userId: string): Promise<Shipment[]>;
	findByDriverId(driverId: string): Promise<Shipment[]>;
	changeStatus(id: string, status: ShipmentStatus): Promise<Shipment>;
	changeDriver(id: string, driverId: string): Promise<Shipment>;
	getHistory(id: string): Promise<ShipmentHistory[]>;
	getShipmentStatistics(startDate?: Date, endDate?: Date): Promise<ShipmentStatistics>;
	getDetailedReports(startDate?: Date, endDate?: Date, status?: string): Promise<ShipmentReport[]>;
}
