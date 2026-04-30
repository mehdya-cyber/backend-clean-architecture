import { Router } from "express";
import { ItemController } from "../controllers/item.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  createItemRequestDto,
  updateItemRequestDto,
} from "../dtos/item/item-request.dto";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { container } from "../../../core/container/container";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { paramsIdDto } from "../../../core/validation/params.validation";

export const createItemRouter = () => {
  const itemRouter = Router();

  const ItemController = container.get<ItemController>(
    CONTAINER_TYPES.ItemController,
  );
  const AuthMiddleware = container.get<AuthMiddleware>(
    CONTAINER_TYPES.AuthMiddleware,
  );

  itemRouter.get("/", AuthMiddleware.requireAuth, ItemController.getAllItems);

  itemRouter.post(
    "/",
    AuthMiddleware.requireAuth,
    validationMiddleware({ body: createItemRequestDto }),
    ItemController.createItem,
  );

  itemRouter.patch(
    "/:id",
    AuthMiddleware.requireAuth,
    validationMiddleware({ body: updateItemRequestDto, params: paramsIdDto }),
    ItemController.updateItem,
  );

  return itemRouter;
};
