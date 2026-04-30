import { prisma } from "../../../../../core/config/prisma";
import {
  IUserEntity,
  UserEntity,
} from "../../../../../domain/entities/user/user.entity";
import { IUserRepository } from "../../../../../domain/interfaces/user-repository.interface";
import { User } from "../../generated/prisma/client";
import { injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
  private toEntity(user: User): UserEntity {
    return new UserEntity({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      isActive: user.isActive,
      tokenVersion: user.tokenVersion,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return this.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return this.toEntity(user);
  }

  async findManyUsers(): Promise<IUserEntity[]> {
    const users = await prisma.user.findMany();

    return users.map(this.toEntity);
  }

  async save(data: UserEntity): Promise<IUserEntity> {
    const user = await prisma.user.create({
      data,
    });

    return this.toEntity(user);
  }

  async update(
    id: string,
    user: Partial<Omit<IUserEntity, "id">>,
  ): Promise<IUserEntity> {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: user,
    });

    return this.toEntity(updatedUser);
  }
}
