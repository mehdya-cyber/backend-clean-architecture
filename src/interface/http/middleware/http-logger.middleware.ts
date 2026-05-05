import pinoHttp from "pino-http";
import { logger } from "../../../core/config/logger";
import { randomUUID } from "node:crypto";

export const httpLoggerMiddleware = pinoHttp({
  logger,

  genReqId: (req, res) => {
    const existingId = req.headers["x-request-id"];

    const requestId =
      typeof existingId === "string" && existingId.length > 0
        ? existingId
        : randomUUID();

    res.setHeader("x-request-id", requestId);
    return requestId;
  },

  customProps(req) {
    return {
      requestId: req.id,
      // userId: req.user?.id,
    };
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "silent";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },

  customErrorMessage: (req, res) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}`;
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers,
      };
    },
  },
});
