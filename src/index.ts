import dotenv from "dotenv";
import { DatabaseInitializerFactory, DatabaseType } from "./infraestructure/database/databaseInitializerFactory";
import app from "./infraestructure/server/app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_TYPE = (process.env.DATABASE_TYPE || "postgres") as DatabaseType;

const startServer = async () => {
	const databaseInitializer = DatabaseInitializerFactory.create(DATABASE_TYPE);
	
	try {
		await databaseInitializer.init();
		
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

startServer();