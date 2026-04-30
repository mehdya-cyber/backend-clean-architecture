import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  loginRequestDto,
  registerRequestDto,
} from "../dtos/auth/auth-request.dto";
import { container } from "../../../core/container/container";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const createAuthRouter = () => {
  const authRouter = Router();

  const AuthController = container.get<AuthController>(
    CONTAINER_TYPES.AuthController,
  );

  const AuthMiddleware = container.get<AuthMiddleware>(
    CONTAINER_TYPES.AuthMiddleware,
  );

  authRouter.post(
    "/register",
    validationMiddleware({ body: registerRequestDto }),
    AuthController.register,
  );

  authRouter.post("/refresh", AuthController.refresh);

  authRouter.post(
    "/login",
    validationMiddleware({ body: loginRequestDto }),
    AuthController.login,
  );

  authRouter.post("/logout", AuthController.logout);

  authRouter.post(
    "/logout-all",
    AuthMiddleware.requireAuth,
    AuthController.logoutAll,
  );

  return authRouter;
};
