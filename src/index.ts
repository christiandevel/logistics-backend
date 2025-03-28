import dotenv from "dotenv";
import colors from "colors";

import { httpServer } from "./infraestructure/server/app";
import { DatabaseInitializerFactory, DatabaseType } from "./infraestructure/database/databaseInitializerFactory";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_TYPE = (process.env.DATABASE_TYPE || "postgres") as DatabaseType;

const startServer = async () => {
	const databaseInitializer = DatabaseInitializerFactory.create(DATABASE_TYPE);
	
	try {
		await databaseInitializer.init();
		
		httpServer.listen(PORT, () => {
			console.log(colors.green.bold(`Server running on port ${PORT}`));
			console.log(colors.blue.bold(`Swagger UI available at http://localhost:${PORT}/api-docs`));
		});
	} catch (error) {
		console.error(colors.red.bold(`Error starting server: ${error}`));
		process.exit(1);
	}
};

startServer();