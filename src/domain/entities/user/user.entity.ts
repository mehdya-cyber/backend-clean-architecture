export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUserEntity {
  readonly id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  tokenVersion: number;
  readonly createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements IUserEntity {
  readonly id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  tokenVersion: number;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(data: IUserEntity) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.isActive = data.isActive;
    this.tokenVersion = data.tokenVersion;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
