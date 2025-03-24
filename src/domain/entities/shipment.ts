export type ShipmentStatus = 'pending' | 'assigned' | 'delivered' | 'canceled';

export class ShipmentHistory {
	id?: number;
	shipmentId: number;
	userId: number;
	notes: string;
	createdAt: Date;
}

export interface ShipmentProps {
	id?: number;
	userId: number;
	driverId: number;
	origin: string;
	destination: string;
	destinationZipcode: string;
	destinationCity: string;
	weight: string;
	width: string;
	height: string;
	length: string;
	productType: string;
	isFragile: boolean;
	specialInstructions: string;
	trackingNumber: string;
	status: ShipmentStatus;
	estimatedDeliveryDate: Date;
	assignedAt: Date;
	createdAt: Date;
	updatedAt: Date;
	history: ShipmentHistory[];
}

export class Shipment {
	id?: number;
	userId: number;
	driverId: number;
	origin: string;
	destination: string;
	destinationZipcode: string;
	destinationCity: string;
	weight: string;
	width: string;
	height: string;
	length: string;
	productType: string;
	isFragile: boolean;
	specialInstructions: string;
	trackingNumber: string;
	status: ShipmentStatus;
	estimatedDeliveryDate: Date;			
	assignedAt: Date;
	createdAt: Date;
	updatedAt: Date;
	history: ShipmentHistory[];
	
	constructor(props: ShipmentProps) {
		this.id = props.id;
		this.userId = props.userId;
		this.driverId = props.driverId;
		this.origin = props.origin;
		this.destination = props.destination;
		this.destinationZipcode = props.destinationZipcode;
		this.destinationCity = props.destinationCity;
		this.weight = props.weight;
		this.width = props.width;
		this.height = props.height;
		this.length = props.length;
		this.productType = props.productType;
		this.isFragile = props.isFragile;
		this.specialInstructions = props.specialInstructions;
		this.trackingNumber = props.trackingNumber;
		this.status = props.status;
		this.estimatedDeliveryDate = props.estimatedDeliveryDate;
		this.assignedAt = props.assignedAt;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.history = props.history;	
		
	}
	
	getId(): number | undefined {
		return this.id;
	}
	
	getUserId(): number {
		return this.userId;
	}
	
	getDriverId(): number {
		return this.driverId;
	}
	
	getOrigin(): string {
		return this.origin;
	}
}

