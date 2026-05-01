import z from "zod";
import { paginationParamsDto } from "../../../../core/validation/pagination.validation";

export const itemParamsDto = z
  .object({
    name: z.string().optional(),
    sortBy: z.enum(["createdAt", "name"]).optional(),
  })
  .extend(paginationParamsDto.shape);

export type TItemParamsDto = z.infer<typeof itemParamsDto>;
