import { Shipment, ShipmentStatus, ShipmentHistory } from "@/domain/entities/shipment";
import { ShipmentRepository } from "@/domain/ports/ShipmentRepository";
import { IRealTimeRepository } from "@/domain/ports/RealTimeRepository";
import { ShipmentReport, ShipmentStatistics } from "../../infraestructure/repositories/postgresShipmentRepository";

export class ShipmentService {
	constructor(
		private readonly shipmentRepository: ShipmentRepository,
		private readonly realTimeRepository: IRealTimeRepository
	) {}
	
	async createShipment(shipment: Omit<Shipment, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
		const newShipment = await this.shipmentRepository.create(shipment);
		this.realTimeRepository.emit('shipment:created', newShipment);
		return newShipment;
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
		const shipment = await this.shipmentRepository.changeStatus(id, status);
		this.realTimeRepository.emit('shipment:statusChanged', { shipment });
		return shipment;
	}
	
	async changeShipmentDriver(id: string, driverId: string): Promise<Shipment> {
		const shipment = await this.shipmentRepository.changeDriver(id, driverId);
		this.realTimeRepository.emit('shipment:driverAssigned', { id, driverId });
		return shipment;
	}
	
	async getShipmentHistory(id: string): Promise<ShipmentHistory[]> {
		return this.shipmentRepository.getHistory(id);
	}
	
	async findShipmentsByDriverId(driverId: string): Promise<Shipment[]> {
		return this.shipmentRepository.findByDriverId(driverId);
	}
	
	async getDetailedReports(startDate?: Date, endDate?: Date, status?: string): Promise<ShipmentReport[]> {
		return this.shipmentRepository.getDetailedReports(startDate, endDate, status);
	}
	
	async getShipmentStatistics(startDate?: Date, endDate?: Date): Promise<ShipmentStatistics> {
		return this.shipmentRepository.getShipmentStatistics(startDate, endDate);
	}
}