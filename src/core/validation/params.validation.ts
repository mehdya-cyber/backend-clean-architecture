import z from "zod";

export const paramsIdDto = z.object({
  id: z.string(),
});

export type TParamsIdDto = z.infer<typeof paramsIdDto>;
