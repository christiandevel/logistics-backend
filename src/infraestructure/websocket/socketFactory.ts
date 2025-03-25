import { SocketIO } from "./socketIo";
import { Server as HttpServer } from "http";

export type SocketType = 'socket.io'

export class SocketFactory {
	
	static create(socketType: SocketType, httpServer: HttpServer) {
		switch (socketType) {
			case "socket.io":
				return new SocketIO(httpServer);
			default:
				throw new Error(`Socket type ${socketType} not supported`);
		}
	}
}
