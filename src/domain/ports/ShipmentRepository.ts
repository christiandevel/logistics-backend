import { Shipment, ShipmentHistory, ShipmentStatus } from "../entities/shipment";

export interface ShipmentRepository {
	create(shipment: Omit<Shipment, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Shipment>;
	findAll(): Promise<Shipment[]>;
	findById(id: string): Promise<Shipment>;
	findByUserId(userId: string): Promise<Shipment[]>;
	changeStatus(id: string, status: ShipmentStatus): Promise<Shipment>;
	changeDriver(id: string, driverId: string): Promise<Shipment>;
	getHistory(id: string): Promise<ShipmentHistory[]>;
}
