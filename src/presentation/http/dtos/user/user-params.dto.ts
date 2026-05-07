import z from "zod";

export const userParamsDto = z.object({
  id: z.string(),
});

export type TUserParamsDto = z.infer<typeof userParamsDto>;
