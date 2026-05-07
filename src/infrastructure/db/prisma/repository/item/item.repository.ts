import { ItemEntity } from "../../../../../domain/entities/item/item.entity";
import {
  FindItemsQuery,
  IItemRepository,
} from "../../../../../domain/interfaces/item-repository.interface";
import { Item, Prisma } from "../../generated/prisma/client";
import { TPaginated } from "../../../../../core/types/paginated.types";
import {
  getPaginatedMeta,
  getPaginationOffset,
} from "../../../../../core/utils/paginated";
import { TransactionContext } from "../../../../../core/types/transaction-context.types";
import { BasePrismaRepository } from "../../base-prisma-repository";
import { prisma } from "../../prisma";

export class ItemRepository
  extends BasePrismaRepository
  implements IItemRepository
{
  private toEntity(item: Item): ItemEntity {
    return new ItemEntity({
      id: item.id,
      name: item.name,
      description: item.description,
      tags: item.tags,
      price: item.price,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }

  async findById(id: string): Promise<ItemEntity | null> {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return null;
    }

    return this.toEntity(item);
  }
  save = async (data: ItemEntity, tx?: TransactionContext) => {
    const item = await this.getClient(tx).item.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags || [],
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });

    return this.toEntity(item);
  };

  findAll = async (
    filters: FindItemsQuery,
  ): Promise<TPaginated<ItemEntity>> => {
    const { page, limit, name, sortBy, sortOrder } = filters;

    const skip = getPaginationOffset(page, limit);

    const where: Prisma.ItemWhereInput = {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy || "createdAt"]: sortOrder || "desc",
        },
      }),
      prisma.item.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toEntity(item)),
      meta: getPaginatedMeta(page, limit, total),
    };
  };

  update = async (id: string, data: Partial<Omit<ItemEntity, "id">>) => {
    const item = await prisma.item.update({
      where: { id },
      data,
    });

    return this.toEntity(item);
  };
}
