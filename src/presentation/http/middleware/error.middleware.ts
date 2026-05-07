import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../core/error/app-error";
import { env } from "../../../core/config/env";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const requestId = req.requestId || res.getHeader("x-request-id");

  if (err instanceof AppError) {
    req.log.warn(
      {
        requestId,
        statusCode: err.statusCode,
        details: err.details,
        method: req.method,
        url: req.url,
        userId: req.user?.userId,
      },
      err.message,
    );

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  req.log.error(
    {
      requestId,
      err,
      method: req.method,
      url: req.url,
      userId: req.user?.userId,
    },
    "Unhandled error",
  );

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    requestId,
    ...(env.NODE_ENV !== "production" && {
      error: err instanceof Error ? err.message : String(err),
    }),
  });
};
