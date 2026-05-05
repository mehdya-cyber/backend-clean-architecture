import { tryCatchAsync } from "../../../core/utils/try-catch-async";
import { Request, Response } from "express";
import { ItemUseCases } from "../../../application/use-cases/item/item.use-cases";
import { ItemMapper } from "../../mappers/item.mapper";
import {
  TCreateItemCommand,
  TUpdateItemCommand,
} from "../../../application/commands/item/item.command";
import { createItemRequestDto } from "../dtos/item/item-request.dto";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { paramsIdDto } from "../../../core/validation/params.validation";
import { TItemsQueryCommand } from "../../../application/commands/item/item.command";
import { itemParamsDto } from "../dtos/item/item-params.dto";

@injectable()
export class ItemController {
  constructor(
    @inject(CONTAINER_TYPES.ItemUseCases)
    public readonly itemUseCases: ItemUseCases,
  ) {}

  getAllItems = tryCatchAsync(async (req: Request, res: Response) => {
    const query = itemParamsDto.parse(req.query);

    const command: TItemsQueryCommand = {
      name: query.name,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
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
    const dto = createItemRequestDto.parse(req.body);

    const userId = req.user!.userId;

    const command: TCreateItemCommand = {
      name: dto.name,
      description: dto.description,
      tags: dto.tags,
      price: dto.price,
      userId,
    };

    const item = await this.itemUseCases.createItemUseCase(command);
    const itemResponse = ItemMapper.toItemResponse(item);

    return res.status(201).json({ success: true, data: itemResponse });
  });

  updateItem = tryCatchAsync(async (req: Request, res: Response) => {
    const dto = createItemRequestDto.parse(req.body);

    const { id } = paramsIdDto.parse(req.params);

    const userId = req.user!.userId;

    const command: TUpdateItemCommand = {
      id,
      patch: {
        name: dto.name,
        description: dto.description,
        tags: dto.tags,
        price: dto.price,
      },
      userId,
    };

    const item = await this.itemUseCases.updateItemUseCase(command);
    const itemResponse = ItemMapper.toItemResponse(item);

    return res.status(200).json({ success: true, data: itemResponse });
  });
}
