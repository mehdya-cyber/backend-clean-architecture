import { TPaginationMeta } from "../types/meta.types";

export const getPaginatedMeta = (
  page: number,
  limit: number,
  total: number,
): TPaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasPrevious: page > 1,
    hasNext: page * limit < total,
  };
};

export const getPaginationOffset = (page: number, limit: number) => {
  return (page - 1) * limit;
};
