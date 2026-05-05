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
import { itemParamsDto } from "../dtos/item/item-params.dto";

export const createItemRouter = () => {
  const itemRouter = Router();

  const ItemController = container.get<ItemController>(
    CONTAINER_TYPES.ItemController,
  );
  const AuthMiddleware = container.get<AuthMiddleware>(
    CONTAINER_TYPES.AuthMiddleware,
  );

  itemRouter.get(
    "/",
    validationMiddleware({ query: itemParamsDto }),
    AuthMiddleware.requireAuth,
    ItemController.getAllItems,
  );

  itemRouter.post(
    "/",
    validationMiddleware({ body: createItemRequestDto }),
    AuthMiddleware.requireAuth,
    ItemController.createItem,
  );

  itemRouter.patch(
    "/:id",
    validationMiddleware({ body: updateItemRequestDto, params: paramsIdDto }),
    AuthMiddleware.requireAuth,
    ItemController.updateItem,
  );

  return itemRouter;
};
