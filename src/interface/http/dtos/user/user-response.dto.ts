import z from "zod";

export const userResponseDto = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TUserResponseDto = z.infer<typeof userResponseDto>;
