import dotenv from "dotenv";
import colors from "colors";

import { app, httpServer } from "./infraestructure/server/app";
import { DatabaseInitializerFactory, DatabaseType } from "./infraestructure/database/databaseInitializerFactory";
import { SocketFactory, SocketType } from "./infraestructure/websocket/socketFactory";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_TYPE = (process.env.DATABASE_TYPE || "postgres") as DatabaseType;
const SOCKET_TYPE = (process.env.SOCKET_TYPE || "socket.io") as SocketType;

const startServer = async () => {
	const databaseInitializer = DatabaseInitializerFactory.create(DATABASE_TYPE);
	const socketFactory = SocketFactory.create(SOCKET_TYPE, httpServer);
	
	try {
		await databaseInitializer.init();
		
		const socketServer = socketFactory.createWebSocketServer();
		socketServer.connect();
		
		httpServer.listen(PORT, () => {
			console.log(colors.green.bold(`Server running on port ${PORT}`));
			console.log(colors.blue.bold(`Swagger UI available at http://localhost:${PORT}/api-docs`));
			console.log(colors.yellow.bold(`WebSocket server running on port ${PORT}`));
		});
	} catch (error) {
		console.error(colors.red.bold(`Error starting server: ${error}`));
		process.exit(1);
	}
};

startServer();