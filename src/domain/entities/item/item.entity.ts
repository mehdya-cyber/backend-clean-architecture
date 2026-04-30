export interface IItemEntity {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  price: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ItemEntity implements IItemEntity {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  price: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IItemEntity) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.price = data.price;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isValidPrice(): boolean {
    return this.price > 0;
  }
}
