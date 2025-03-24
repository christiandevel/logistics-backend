import { Shipment, ShipmentStatus, ShipmentHistory } from "@/domain/entities/shipment";
import { ShipmentRepository } from "@/domain/ports/ShipmentRepository";
import { Pool } from "pg";

export class PostgresShipmentRepository implements ShipmentRepository {
	
	constructor(private readonly pool: Pool) {}
	
	async create(shipment: Shipment): Promise<Shipment> {
		const result = await this.pool.query(
			'INSERT INTO shipments (user_id, driver_id, origin, destination, destination_zipcode, destination_city, weight, width, height, length, product_type, is_fragile, special_instructions, tracking_number, status, estimated_delivery_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
			[shipment.userId, shipment.driverId, shipment.origin, shipment.destination, shipment.destinationZipcode, shipment.destinationCity, shipment.weight, shipment.width, shipment.height, shipment.length, shipment.productType, shipment.isFragile, shipment.specialInstructions, shipment.trackingNumber, shipment.status, shipment.estimatedDeliveryDate]
		);
		return result.rows[0] as Shipment;
	}
	
	async findAll(): Promise<Shipment[]> {
		const result = await this.pool.query('SELECT * FROM shipments');
		return result.rows as Shipment[];
	}
	
	async findById(id: string): Promise<Shipment | null> {
		const result = await this.pool.query('SELECT * FROM shipments WHERE id = $1', [id]);
		return result.rows[0] as Shipment;
	}
	
	async findByUserId(userId: string): Promise<Shipment[]> {
		const result = await this.pool.query('SELECT * FROM shipments WHERE user_id = $1', [userId]);
		return result.rows as Shipment[];
	}
	
	async changeStatus(id: string, status: ShipmentStatus): Promise<Shipment> {
		const result = await this.pool.query('UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
		return result.rows[0] as Shipment;
	}
	
	async changeDriver(id: string, driverId: string): Promise<Shipment> {
		const result = await this.pool.query('UPDATE shipments SET driver_id = $1 WHERE id = $2 RETURNING *', [driverId, id]);
		return result.rows[0] as Shipment;
	}
	
	async getHistory(id: string): Promise<ShipmentHistory[]> {
		const result = await this.pool.query('SELECT * FROM history_shipments WHERE shipment_id = $1', [id]);
		return result.rows;
	}
}