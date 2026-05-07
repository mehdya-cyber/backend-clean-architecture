import z from "zod";

export const itemResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  price: z.number(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TItemResponseDto = z.infer<typeof itemResponseDto>;
