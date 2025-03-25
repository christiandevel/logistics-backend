import { Shipment, ShipmentStatus, ShipmentHistory } from "@/domain/entities/shipment";
import { ShipmentRepository } from "@/domain/ports/ShipmentRepository";
import { Pool } from "pg";

export interface ShipmentReport {
	id: number;
	trackingNumber: string;
	status: string;
	origin: string;
	destination: string;
	destinationCity: string;
	estimatedDeliveryDate: Date;
	actualDeliveryDate?: Date;
	deliveryTimeInDays?: number;
	driverInfo?: {
		id: number;
		fullName: string;
		email: string;
	};
	createdAt: Date;
	updatedAt: Date;
	history: ShipmentHistory[];
}

export interface ShipmentStatistics {
	totalShipments: number;
	statusCounts: {
		PENDING: number;
		PICKED_UP: number;
		IN_TRANSIT: number;
		DELIVERED: number;
		CANCELLED: number;
	};
	averageDeliveryTime: number;
	totalDelivered: number;
	totalInTransit: number;
	totalPending: number;
	totalCancelled: number;
	shipmentsByCity: {
		city: string;
		count: number;
	}[];
	shipmentsByDate: {
		date: string;
		count: number;
	}[];
}

export class PostgresShipmentRepository implements ShipmentRepository {
	
	constructor(private readonly pool: Pool) {}
	
	async create(shipment: Omit<Shipment, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
		// Generate a unique tracking number
		const trackingNumber = `SHIP${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
		
		const result = await this.pool.query(
			`INSERT INTO shipments (user_id, origin, destination, destination_zipcode, destination_city, weight, width, height, length, product_type, is_fragile, special_instructions, tracking_number, status, estimated_delivery_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
			[shipment.userId, shipment.origin, shipment.destination, shipment.destinationZipcode, shipment.destinationCity, shipment.weight, shipment.width, shipment.height, shipment.length, shipment.productType, shipment.isFragile, shipment.specialInstructions, trackingNumber, 'PENDING', shipment.estimatedDeliveryDate]
		);
		
		return result.rows[0] as Shipment;
	}
	
	async findAll(status?: string): Promise<Shipment[]> {
		const query = `
			SELECT 
				s.*,
				CASE 
					WHEN s.driver_id IS NOT NULL AND s.status != 'PENDING' THEN 
						jsonb_build_object(
							'id', u.id,
							'full_name', u.full_name,
							'email', u.email
						)
					ELSE NULL
				END as driver_info
			FROM shipments s
			LEFT JOIN users u ON s.driver_id = u.id AND s.status != 'PENDING'
			${status ? 'WHERE s.status = $1' : ''}
			ORDER BY s.created_at DESC
		`;
		
		const values = status ? [status.toUpperCase()] : [];
		const result = await this.pool.query(query, values);
		
		return result.rows.map(row => {
			const { driver_info, ...shipmentData } = row;
			return {
				...shipmentData,
				driverInfo: driver_info,
				// Si el estado es PENDING, aseguramos que no haya información del conductor
				...(row.status === 'PENDING' ? { driver_id: null, driverInfo: null } : {})
			} as Shipment;
		});
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
		const result = await this.pool.query(
			`UPDATE shipments 
			SET driver_id = $1::integer, 
				assigned_at = NOW(),
				status = 'PICKED_UP'
			WHERE id = $2::integer 
			RETURNING *`,
			[driverId, id]
		);
		return result.rows[0] as Shipment;
	}
	
	async getHistory(id: string): Promise<ShipmentHistory[]> {
		const result = await this.pool.query(
			'SELECT * FROM history_shipments WHERE shipment_id = $1 ORDER BY created_at DESC',
			[id]
		);
		return result.rows;
	}
	
	async findByDriverId(driverId: string): Promise<Shipment[]> {
		const query = `
			SELECT 
				s.*,
				jsonb_build_object(
					'id', u.id,
					'full_name', u.full_name,
					'email', u.email
				) as driver_info
			FROM shipments s
			LEFT JOIN users u ON s.driver_id = u.id
			WHERE s.driver_id = $1 AND s.status != 'PENDING'
			ORDER BY s.created_at DESC
		`;
		
		const result = await this.pool.query(query, [driverId]);
		
		return result.rows.map(row => {
			const { driver_info, ...shipmentData } = row;
			return {
				...shipmentData,
				driverInfo: driver_info
			} as Shipment;
		});
	}

	async getDetailedReports(startDate?: Date, endDate?: Date, status?: string): Promise<ShipmentReport[]> {
		console.log('getDetailedReports');
		const query = `
			WITH shipment_details AS (
				SELECT 
					s.*,
					CASE 
						WHEN s.driver_id IS NOT NULL AND s.status != 'PENDING' THEN 
							jsonb_build_object(
								'id', u.id,
								'fullName', u.full_name,
								'email', u.email
							)
						ELSE NULL
					END as driver_info,
					CASE 
						WHEN s.status = 'DELIVERED' THEN 
							EXTRACT(EPOCH FROM (s.updated_at - s.created_at)) / (24 * 60 * 60)
						ELSE NULL
					END as delivery_time_days
				FROM shipments s
				LEFT JOIN users u ON s.driver_id = u.id
				WHERE 1=1
					${startDate ? 'AND s.created_at >= $1' : ''}
					${endDate ? 'AND s.created_at <= $2' : ''}
					${status ? 'AND s.status = $3' : ''}
			)
			SELECT 
				sd.id,
				sd.tracking_number,
				sd.status,
				sd.origin,
				sd.destination,
				sd.destination_city,
				sd.estimated_delivery_date,
				sd.updated_at,
				sd.created_at,
				sd.driver_info,
				sd.delivery_time_days,
				COALESCE(
					json_agg(
						json_build_object(
							'id', h.id,
							'shipmentId', h.shipment_id,
							'userId', h.user_id,
							'notes', h.notes,
							'createdAt', h.created_at
						)
					) FILTER (WHERE h.id IS NOT NULL),
					'[]'::json
				) as history
			FROM shipment_details sd
			LEFT JOIN history_shipments h ON sd.id = h.shipment_id
			GROUP BY 
				sd.id,
				sd.tracking_number,
				sd.status,
				sd.origin,
				sd.destination,
				sd.destination_city,
				sd.estimated_delivery_date,
				sd.updated_at,
				sd.created_at,
				sd.driver_info,
				sd.delivery_time_days
			ORDER BY sd.created_at DESC
		`;

		const values = [];
		if (startDate) values.push(startDate);
		if (endDate) values.push(endDate);
		if (status) values.push(status);

		const result = await this.pool.query(query, values);
		
		console.log('Query executed successfully');

		return result.rows.map(row => ({
			id: row.id,
			trackingNumber: row.tracking_number,
			status: row.status,
			origin: row.origin,
			destination: row.destination,
			destinationCity: row.destination_city,
			estimatedDeliveryDate: row.estimated_delivery_date,
			actualDeliveryDate: row.status === 'DELIVERED' ? row.updated_at : undefined,
			deliveryTimeInDays: row.delivery_time_days,
			driverInfo: row.driver_info,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			history: row.history
		}));
	}

	async getShipmentStatistics(startDate?: Date, endDate?: Date): Promise<ShipmentStatistics> {
		const query = `
			WITH date_filtered_shipments AS (
				SELECT *
				FROM shipments
				WHERE 1=1
					${startDate ? 'AND created_at >= $1' : ''}
					${endDate ? 'AND created_at <= $2' : ''}
			),
			status_counts AS (
				SELECT 
					status,
					COUNT(*) as count
				FROM date_filtered_shipments
				GROUP BY status
			),
			delivery_times AS (
				SELECT 
					AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / (24 * 60 * 60)) as avg_delivery_time
				FROM date_filtered_shipments
				WHERE status = 'DELIVERED'
			),
			shipments_by_city AS (
				SELECT 
					destination_city as city,
					COUNT(*) as count
				FROM date_filtered_shipments
				GROUP BY destination_city
				ORDER BY count DESC
				LIMIT 10
			),
			shipments_by_date AS (
				SELECT 
					DATE(created_at) as date,
					COUNT(*) as count
				FROM date_filtered_shipments
				GROUP BY DATE(created_at)
				ORDER BY date DESC
				LIMIT 30
			)
			SELECT 
				(SELECT COUNT(*) FROM date_filtered_shipments) as total_shipments,
				(SELECT jsonb_object_agg(status, count) FROM status_counts) as status_counts,
				(SELECT avg_delivery_time FROM delivery_times) as average_delivery_time,
				(SELECT COUNT(*) FROM date_filtered_shipments WHERE status = 'DELIVERED') as total_delivered,
				(SELECT COUNT(*) FROM date_filtered_shipments WHERE status = 'IN_TRANSIT') as total_in_transit,
				(SELECT COUNT(*) FROM date_filtered_shipments WHERE status = 'PENDING') as total_pending,
				(SELECT COUNT(*) FROM date_filtered_shipments WHERE status = 'CANCELLED') as total_cancelled,
				(SELECT json_agg(json_build_object('city', city, 'count', count)) FROM shipments_by_city) as shipments_by_city,
				(SELECT json_agg(json_build_object('date', date, 'count', count)) FROM shipments_by_date) as shipments_by_date
		`;

		const values = [];
		if (startDate) values.push(startDate);
		if (endDate) values.push(endDate);

		const result = await this.pool.query(query, values);
		const stats = result.rows[0];

		return {
			totalShipments: parseInt(stats.total_shipments),
			statusCounts: stats.status_counts || {
				PENDING: 0,
				PICKED_UP: 0,
				IN_TRANSIT: 0,
				DELIVERED: 0,
				CANCELLED: 0
			},
			averageDeliveryTime: parseFloat(stats.average_delivery_time) || 0,
			totalDelivered: parseInt(stats.total_delivered),
			totalInTransit: parseInt(stats.total_in_transit),
			totalPending: parseInt(stats.total_pending),
			totalCancelled: parseInt(stats.total_cancelled),
			shipmentsByCity: stats.shipments_by_city || [],
			shipmentsByDate: stats.shipments_by_date || []
		};
	}
}