import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { AppError } from "../../../core/error/app-error";
import bcrypt from "bcrypt";
import { TCreateUserCommand } from "../../commands/user/user.command";
import { UserEntity } from "../../../domain/entities/user/user.entity";
import { randomUUID } from "crypto";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";

@injectable()
export class UserUseCases {
  constructor(
    @inject(CONTAINER_TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  getUserUseCase = async ({ id }: { id: string }) => {
    const user = await this.userRepository.findById(id);

    if (!user) throw new AppError("User not found", 404);

    return user;
  };

  getUsersUseCase = async () => {
    return this.userRepository.findManyUsers();
  };

  createUserUseCase = async (data: TCreateUserCommand) => {
    const user = await this.userRepository.findByEmail(data.email);

    if (user) throw new AppError("User already exists", 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = new UserEntity({
      id: randomUUID(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      role: data.role,
      tokenVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.save(userData);
  };
}
