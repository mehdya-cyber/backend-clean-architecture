import z from "zod";

export const itemRequestDto = z
  .object({
    name: z.string({ error: "Name is required" }),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    price: z
      .number({ error: "Price must be a number" })
      .min(0, "Price must be positive"),
  })
  .strict();

export const createItemRequestDto = itemRequestDto.pick({
  name: true,
  description: true,
  tags: true,
  price: true,
});

export const updateItemRequestDto = itemRequestDto
  .pick({
    name: true,
    description: true,
    tags: true,
    price: true,
  })
  .partial();

export type TCreateItemRequestDto = z.infer<typeof createItemRequestDto>;
export type TUpdateItemRequestDto = z.infer<typeof updateItemRequestDto>;
