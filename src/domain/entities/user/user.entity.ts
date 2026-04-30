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
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements IUserEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly role: UserRole;
  public readonly isActive: boolean;
  public readonly tokenVersion: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

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
