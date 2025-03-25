import { Shipment, ShipmentStatus, ShipmentHistory } from "@/domain/entities/shipment";
import { ShipmentRepository } from "@/domain/ports/ShipmentRepository";

export class ShipmentService {
	constructor(private readonly shipmentRepository: ShipmentRepository) {}
	
	async createShipment(shipment: Omit<Shipment, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
		return this.shipmentRepository.create(shipment);
	}
	
	async findAllShipments(status?: string): Promise<Shipment[]> {
		return this.shipmentRepository.findAll(status);
	}
	
	async findShipmentById(id: string): Promise<Shipment> {
		return this.shipmentRepository.findById(id);
	}
	
	async findShipmentsByUserId(userId: string): Promise<Shipment[]> {
		return this.shipmentRepository.findByUserId(userId);
	}
	
	async changeShipmentStatus(id: string, status: ShipmentStatus): Promise<Shipment> {
		return this.shipmentRepository.changeStatus(id, status);
	}
	
	async changeShipmentDriver(id: string, driverId: string): Promise<Shipment> {
		return this.shipmentRepository.changeDriver(id, driverId);
	}
	
	async getShipmentHistory(id: string): Promise<ShipmentHistory[]> {
		return this.shipmentRepository.getHistory(id);
	}
	
	
}