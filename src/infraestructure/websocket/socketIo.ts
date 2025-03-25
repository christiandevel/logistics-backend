import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

import { WebSocketFactory, WebSocketServer } from "@/domain/ports/socket";

export class SocketIO implements WebSocketFactory {
	
	private io: Server;
	
	constructor(server: HttpServer) {
		this.io = new Server(server, {
			cors: {
				origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
				methods: ['GET', 'POST'],
			},
		});
	}
	
	createWebSocketServer(): WebSocketServer {
		return {
			
			connect: () => this.io.on('connection', (socket) => {
				console.log('New connection', socket.id);
			}),
			
			disconnect: () => this.io.on('disconnect', (socket) => {
				console.log('User disconnected', socket.id);
			}),
			
			emit: (event: string, data: any) => this.io.emit(event, data),
			
			onConnection: (callback: (socket: Socket) => void) => this.io.on('connection', callback),
			
			onEvent: (event: string, handler: (data: any) => void) => this.io.on(event, handler),
		}
	}
}