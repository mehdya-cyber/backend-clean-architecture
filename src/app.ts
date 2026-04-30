import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { router } from "./interface/http/routes";
import { env } from "./core/config/env";
import { notFoundMiddleware } from "./interface/http/middleware/not-found.middleware";
import { errorMiddleware } from "./interface/http/middleware/error.middleware";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [env.CORS_ORIGIN],
    credentials: true,
  }),
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
