import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { router } from "./presentation/http/routes";
import { env } from "./core/config/env";
import { notFoundMiddleware } from "./presentation/http/middleware/not-found.middleware";
import { errorMiddleware } from "./presentation/http/middleware/error.middleware";
import { httpLoggerMiddleware } from "./presentation/http/middleware/http-logger.middleware";
import { requestIdMiddleware } from "./presentation/http/middleware/request-id.middleware";

export const app = express();

app.use(requestIdMiddleware);
app.use(express.json());
app.use(httpLoggerMiddleware);

app.use(helmet());
app.use(cookieParser());

app.use(
  cors({
    origin: [env.CORS_ORIGIN],
    credentials: true,
  }),
);

app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
