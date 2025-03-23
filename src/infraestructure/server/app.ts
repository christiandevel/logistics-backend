import express from "express";

const app = express();

app.use(express.json());

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

export default app;