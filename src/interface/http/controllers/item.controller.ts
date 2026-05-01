import { tryCatchAsync } from "../../../core/utils/try-catch-async";
import { Request, Response } from "express";
import { ItemUseCases } from "../../../application/use-cases/item/item.use-cases";
import { ItemMapper } from "../../mappers/item.mapper";
import {
  TCreateItemCommand,
  TUpdateItemCommand,
} from "../../../application/commands/item/item.command";
import { TCreateItemRequestDto } from "../dtos/item/item-request.dto";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { AppError } from "../../../core/error/app-error";
import { TParamsIdDto } from "../../../core/validation/params.validation";
import { TItemParamsDto } from "../dtos/item/item-params.dto";
import { TGetItemsCommand } from "../../../application/commands/item/item.command";

@injectable()
export class ItemController {
  constructor(
    @inject(CONTAINER_TYPES.ItemUseCases)
    public readonly itemUseCases: ItemUseCases,
  ) {}

  getAllItems = tryCatchAsync(async (req: Request, res: Response) => {
    const query: TItemParamsDto = req.query;

    const command: TGetItemsCommand = {
      name: query.name,
      sortBy: query.sortBy,
      page: query.page,
      limit: query.limit,
    };

    const items = await this.itemUseCases.getItemsUseCase(command);
    const itemResponse = items.data.map((item) =>
      ItemMapper.toItemResponse(item),
    );
    return res.status(200).json({ success: true, data: itemResponse });
  });

  createItem = tryCatchAsync(async (req: Request, res: Response) => {
    const dto: TCreateItemRequestDto = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("User ID is required", 401);
    }

    const command: TCreateItemCommand = {
      name: dto.name,
      description: dto.description,
      tags: dto.tags,
      price: dto.price,
    };

    const item = await this.itemUseCases.createItemUseCase(userId, command);
    const itemResponse = ItemMapper.toItemResponse(item);

    return res.status(201).json({ success: true, data: itemResponse });
  });

  updateItem = tryCatchAsync(
    async (req: Request<TParamsIdDto>, res: Response) => {
      const dto: TCreateItemRequestDto = req.body;

      const { id } = req.params;

      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError("User ID is required", 401);
      }

      const command: TUpdateItemCommand = {
        id,
        name: dto.name,
        description: dto.description,
        tags: dto.tags,
        price: dto.price,
      };

      const item = await this.itemUseCases.updateItemUseCase(userId, command);
      const itemResponse = ItemMapper.toItemResponse(item);

      return res.status(200).json({ success: true, data: itemResponse });
    },
  );
}
