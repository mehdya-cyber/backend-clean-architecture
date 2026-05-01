import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { AppError } from "../../../core/error/app-error";
import { IItemRepository } from "../../../domain/interfaces/item-repository.interface";
import {
  TCreateItemCommand,
  TUpdateItemCommand,
  TGetItemsCommand,
} from "../../commands/item/item.command";
import { ItemEntity } from "../../../domain/entities/item/item.entity";
import { randomUUID } from "crypto";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";

@injectable()
export class ItemUseCases {
  constructor(
    @inject(CONTAINER_TYPES.ItemRepository)
    private itemRepository: IItemRepository,
    @inject(CONTAINER_TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}

  getItemsUseCase = async (query: TGetItemsCommand) => {
    return this.itemRepository.findAll(query);
  };

  createItemUseCase = async (userId: string, data: TCreateItemCommand) => {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const itemData = new ItemEntity({
      id: randomUUID(),
      name: data.name,
      description: data.description || null,
      tags: data.tags || [],
      price: data.price,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const item = await this.itemRepository.save(itemData);
    return item;
  };

  updateItemUseCase = async (
    userId: string,
    data: Partial<TUpdateItemCommand>,
  ) => {
    const item = await this.itemRepository.findById(data.id!);

    const user = await this.userRepository.findById(userId);

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    const itemData = new ItemEntity({
      ...item,
      ...data,
      userId,
      // id: data.id,
      // name: data.name,
      // description: data.description || null,
      // tags: data.tags || null,
      // price: data.price,
      // userId: item.userId,
      // createdAt: item.createdAt,
      // updatedAt: new Date(),
    });

    const updatedItem = await this.itemRepository.update(userId, itemData);
    return updatedItem;
  };
}
