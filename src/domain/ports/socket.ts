export interface WebSocketServer {
	connect(): void;
	disconnect(): void;
	emit(event: string, data: any): void;
	onConnection(handler: (socket: any) => void): void;
	onEvent(event: string, handler: (data: any) => void): void;
}

export interface WebSocketFactory {
	createWebSocketServer(): WebSocketServer
}