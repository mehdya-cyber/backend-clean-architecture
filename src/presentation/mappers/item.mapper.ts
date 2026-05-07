import { IItemEntity } from "../../domain/entities/item/item.entity";

export class ItemMapper {
  static toItemResponse(item: IItemEntity) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      tags: item.tags,
      price: item.price,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
