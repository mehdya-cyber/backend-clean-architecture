import z from "zod";

export const registerResponseDto = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }),
  token: z.string(),
});

export const loginResponseDto = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }),
  token: z.string(),
});

export type TRegisterResponseDto = z.infer<typeof registerResponseDto>;
export type TLoginResponseDto = z.infer<typeof loginResponseDto>;
