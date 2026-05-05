export type TCreateItemCommand = {
  name: string;
  description: string | undefined;
  tags: string[] | undefined;
  price: number;
  userId: string;
};

export type TUpdateItemCommand = {
  id: string;
  patch: {
    name?: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    price?: number;
  };
  userId: string;
};

export type TItemsQueryCommand = {
  page: number;
  limit: number;
  name?: string;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
};
