import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/error/app-error";

type TValidationMiddleware = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

export const validationMiddleware = ({
  body,
  params,
  query,
}: TValidationMiddleware) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (body) body.parse(req.body);
      if (params) params.parse(req.params);
      if (query) query.parse(req.query);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError("Validation failed", 400, error.issues));
      }
      return next(error);
    }
  };
};
