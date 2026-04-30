import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/error/app-error";
import { JwtService } from "../../../core/utils/jwt";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";

type TAccessTokenPayload = {
  userId: string;
  role: string;
  sub: string;
  tokenVersion: number;
  exp: number;
};

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(CONTAINER_TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return next(new AppError("Missing or invalid token", 401));
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return next(new AppError("Missing or invalid token", 401));
      }

      const payload = JwtService.verifyAccessToken(
        token,
      ) as TAccessTokenPayload;

      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        return next(new AppError("User not found", 401));
      }

      if (payload.tokenVersion !== user.tokenVersion) {
        return next(new AppError("Token has been revoked", 401));
      }

      req.user = { userId: user.id, role: user.role, email: user.email };

      next();
    } catch (error) {
      next(new AppError("Invalid or expired token", 401));
    }
  };

  requireRole = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError("Unauthorized", 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError("Forbidden", 403));
      }

      next();
    };
  };
}
