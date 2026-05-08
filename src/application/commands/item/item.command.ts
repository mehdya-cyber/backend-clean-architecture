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

export type TItemBulkUploadCommand = {
  fileName: string;
  items: {
    name: string;
    price: number;
    tags: string[];
  }[];
  userId: string;
};

export type TProcessBulkUploadItemsCommand = {
  bulkUploadId: string;
  data: {
    name: string;
    price: number;
    tags: string[];
  }[];
};

export type TItemBulkUploadJobData = {
  bulkUploadId: string;
  userId: string;
  items: {
    name: string;
    price: number;
    tags: string[];
  }[];
};
