import { IItemEntity } from "../entities/item/item.entity";

export interface IItemRepository {
  findById(id: string): Promise<IItemEntity | null>;
  save(data: IItemEntity): Promise<IItemEntity>;
  findAll(): Promise<IItemEntity[]>;
  update(
    id: string,
    data: Partial<Omit<IItemEntity, "id">>,
  ): Promise<IItemEntity>;
}
