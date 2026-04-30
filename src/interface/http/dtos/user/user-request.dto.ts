import z from "zod";
import { USER_ROLES } from "../../../../domain/entities/user/user.entity";

export const userRequestDto = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(Object.values(USER_ROLES)),
});

export const createUserRequestDto = userRequestDto.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const updateUserRequestDto = userRequestDto.pick({
  firstName: true,
  lastName: true,
});

export type TCreateUserRequestDto = z.infer<typeof createUserRequestDto>;
export type TUpdateUserRequestDto = z.infer<typeof updateUserRequestDto>;
