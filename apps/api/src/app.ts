import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/index.ts"
import { notFoundHandler } from "./middlewares/notFoundHandler.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import {requestLogger} from "./middlewares/requestLogger.ts";

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;