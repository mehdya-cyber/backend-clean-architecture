import { NextFunction, Request, Response } from "express";

export const tryCatchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      return fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};
