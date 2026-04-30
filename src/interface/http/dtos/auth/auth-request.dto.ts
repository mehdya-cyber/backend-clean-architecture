import z from "zod";
import { USER_ROLES } from "../../../../domain/entities/user/user.entity";

export const authRequestDto = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([...Object.values(USER_ROLES)]),
});

export const loginRequestDto = authRequestDto.pick({
  email: true,
  password: true,
});

export const registerRequestDto = authRequestDto
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
    role: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TRegisterRequestDto = z.infer<typeof registerRequestDto>;
export type TLoginRequestDto = z.infer<typeof loginRequestDto>;
