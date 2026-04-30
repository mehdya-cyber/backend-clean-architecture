import { UserRole } from "../../../domain/entities/user/user.entity";

export type TCreateTokenCommand = {
  userId: string;
  familyId: string;
  tokenHash: string;

  expiresAt: Date;
};
export type TRegisterCommand = {
  email: string;
  password: string;
  firstName: string;
  role: UserRole;
  lastName: string;
  userAgent: string | null;
  ipAddress: string | undefined;
};

export type TLoginCommand = {
  email: string;
  password: string;
  userAgent: string | null;
  ipAddress: string | undefined;
};
