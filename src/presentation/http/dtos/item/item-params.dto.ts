import z from "zod";
import { paginationParamsDto } from "../../../validation/pagination.validation";

export const itemParamsDto = z
  .object({
    name: z.string().optional(),
    sortBy: z.enum(["createdAt", "name"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .extend(paginationParamsDto.shape)
  .strict();

export type TItemParamsDto = z.infer<typeof itemParamsDto>;
