import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { container } from "../../../core/container/container";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { paramsIdDto } from "../../../core/validation/params.validation";

export const createUserRouter = () => {
  const userRouter = Router();

  const userController = container.get<UserController>(
    CONTAINER_TYPES.UserController,
  );

  const AuthMiddleware = container.get<AuthMiddleware>(
    CONTAINER_TYPES.AuthMiddleware,
  );

  userRouter.get("/", AuthMiddleware.requireAuth, userController.getUsers);

  userRouter.get(
    "/:id",
    AuthMiddleware.requireAuth,
    validationMiddleware({ params: paramsIdDto }),
    userController.getUser,
  );

  return userRouter;
};
