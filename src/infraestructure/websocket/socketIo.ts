import { Server } from "socket.io";
import { IRealTimeRepository } from "@/domain/ports/RealTimeRepository";
import colors from "colors";

export class SocketIOService implements IRealTimeRepository {
	private io: Server;

	constructor(io: Server) {
		this.io = io;
	}

	emit(event: string, data: any): void {
		console.log(colors.green.bold(`Emitting event: ${event}`));
		this.io.emit(event, data);
	}
} 