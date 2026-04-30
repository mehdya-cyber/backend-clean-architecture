import z from "zod";

export const itemParamsDto = z.object({
  id: z.string(),
});

export type TItemParamsDto = z.infer<typeof itemParamsDto>;
