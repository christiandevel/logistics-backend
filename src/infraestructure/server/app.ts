import express from "express";
import swaggerUi from "swagger-ui-express";
import authRoutes from "../routes/authRoutes";

import { swaggerSpec } from "../config/swagger";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	explorer: true,
	customCss: ".topbar { display: none }",
	customSiteTitle: "API Logistics",
	customfavIcon: '/favicon.ico'
}));

// routes
app.use('/api/auth', authRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

export default app;