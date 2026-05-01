export type TPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

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
