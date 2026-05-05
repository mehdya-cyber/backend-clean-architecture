import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { AppError } from "../../../core/error/app-error";
import { IItemRepository } from "../../../domain/interfaces/item-repository.interface";
import {
  TCreateItemCommand,
  TUpdateItemCommand,
  TItemsQueryCommand,
} from "../../commands/item/item.command";
import { ItemEntity } from "../../../domain/entities/item/item.entity";
import { randomUUID } from "crypto";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { IAuditLogRepository } from "../../../domain/interfaces/audit-log-repository.interface";
import { ITransactionManager } from "../../../core/interfaces/transaction-manager.interfaces";

@injectable()
export class ItemUseCases {
  constructor(
    @inject(CONTAINER_TYPES.ItemRepository)
    private itemRepository: IItemRepository,
    @inject(CONTAINER_TYPES.UserRepository)
    private userRepository: IUserRepository,

    @inject(CONTAINER_TYPES.AuditLogRepository)
    private auditLogRepository: IAuditLogRepository,

    @inject(CONTAINER_TYPES.TransactionManager)
    private transactionManager: ITransactionManager,
  ) {}

  getItemsUseCase = async (query: TItemsQueryCommand) => {
    return this.itemRepository.findAll(query);
  };

  createItemUseCase = async (data: TCreateItemCommand) => {
    return this.transactionManager.runInTransaction(async (tx) => {
      const user = await this.userRepository.findById(data.userId);

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

      await this.auditLogRepository.create(
        {
          actorId: data.userId,
          action: "ITEM_CREATED",
          entity: "item",
          entityId: item.id,
          metadata: {
            itemId: item.id,
            name: item.name,
            price: item.price,
            tags: item.tags,
          },
        },
        tx,
      );

      return item;
    });
  };

  updateItemUseCase = async (data: TUpdateItemCommand) => {
    const item = await this.itemRepository.findById(data.id);

    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    const itemData = new ItemEntity({
      ...item,
      ...data.patch,
      userId: data.userId,
    });

    await this.auditLogRepository.create({
      actorId: data.userId,
      action: "ITEM_UPDATED",
      entity: "item",
      entityId: item.id,
      metadata: {
        itemId: item.id,
        name: item.name,
        price: item.price,
        tags: item.tags,
      },
    });

    const updatedItem = await this.itemRepository.update(data.id, itemData);
    return updatedItem;
  };
}
