import express from "express";
import { createServer } from "http";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

// Swagger config	
import { swaggerSpec } from "../config/swagger";

// Routes
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import shipmentRoutes from "../routes/shipmentRoutes";

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	explorer: true,
	customCss: ".topbar { display: none }",
	customSiteTitle: "API Logistics",
	customfavIcon: './assets/cropped-favicon.png'
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err);
	res.status(500).send("Internal Server Error");
});

export { app, httpServer };