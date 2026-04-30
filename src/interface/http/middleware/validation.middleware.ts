import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/error/app-error";

type TValidationMiddleware = {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
};

export const validationMiddleware = ({
  body,
  params,
  query,
}: TValidationMiddleware) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params) as Request["params"];
      if (query) req.query = query.parse(req.query) as Request["query"];

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError("Validation failed", 400, error.issues));
      }
      return next(error);
    }
  };
};
