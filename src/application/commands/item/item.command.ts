export type TCreateItemCommand = {
  name: string;
  description: string | undefined;
  tags: string[] | undefined;
  price: number;
};

export type TUpdateItemCommand = {
  id: string;
  name: string;
  description: string | undefined;
  tags: string[] | undefined;
  price: number;
};

export type TGetItemsCommand = {
  page: number;
  limit: number;
  name?: string;
  sortBy?: "createdAt" | "name";
};
