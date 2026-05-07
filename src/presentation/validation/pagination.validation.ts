import z from "zod";

export const paginationParamsDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type TPaginationParamsDto = z.infer<typeof paginationParamsDto>;
