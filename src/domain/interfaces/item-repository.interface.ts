import { TPaginated } from "../../core/types/paginated.types";
import { IItemEntity } from "../entities/item/item.entity";

export type FindItemsQuery = {
  page: number;
  limit: number;
  name?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export interface IItemRepository {
  findById(id: string): Promise<IItemEntity | null>;
  save(data: IItemEntity, tx?: unknown): Promise<IItemEntity>;
  findAll(filters: FindItemsQuery): Promise<TPaginated<IItemEntity>>;
  update(
    id: string,
    data: Partial<Omit<IItemEntity, "id">>,
    tx?: unknown,
  ): Promise<IItemEntity>;
}
