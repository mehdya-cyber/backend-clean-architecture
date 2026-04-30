import { UserRole } from "../../../domain/entities/user/user.entity";

export type TCreateUserCommand = {
  email: string;
  password: string;
  firstName: string;
  role: UserRole;
  lastName: string;
};
