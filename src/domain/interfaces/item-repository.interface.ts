import { TPaginated } from "../../core/types/paginated.types";
import { ItemEntity } from "../entities/item/item.entity";

export type FindItemsQuery = {
  page: number;
  limit: number;
  name?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export interface IItemRepository {
  findById(id: string): Promise<ItemEntity | null>;
  save(data: ItemEntity, tx?: unknown): Promise<ItemEntity>;
  findAll(filters: FindItemsQuery): Promise<TPaginated<ItemEntity>>;
  update(
    id: string,
    data: Partial<Omit<ItemEntity, "id">>,
    tx?: unknown,
  ): Promise<ItemEntity>;
}
