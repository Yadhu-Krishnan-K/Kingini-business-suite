import express, { type Application } from "express";
import cors from "cors";

import apiRouter from "./routes/index.ts"

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

export default app;