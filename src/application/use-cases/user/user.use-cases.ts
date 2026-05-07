import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { AppError } from "../../../core/error/app-error";
import { TCreateUserCommand } from "../../commands/user/user.command";
import { UserEntity } from "../../../domain/entities/user/user.entity";
import { IAuditLogRepository } from "../../../domain/interfaces/audit-log-repository.interface";
import { IHashService } from "../../ports/hash-service.port";

export class UserUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly auditLogRepository: IAuditLogRepository,

    private readonly hashService: IHashService,
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

    const hashedPassword = await this.hashService.hashPassword(
      data.password,
      10,
    );

    const userData = new UserEntity({
      id: this.hashService.randomUUID(),
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

    await this.auditLogRepository.create({
      actorId: userData.id,
      action: "USER_CREATED",
      entity: "user",
      entityId: userData.id,
      metadata: {
        userId: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      },
    });

    return this.userRepository.save(userData);
  };
}
