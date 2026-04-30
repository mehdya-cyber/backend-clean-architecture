import { Request, Response } from "express";
import { tryCatchAsync } from "../../../core/utils/try-catch-async";
import { UserUseCases } from "../../../application/use-cases/user/user.use-cases";
import { UserMapper } from "../../mappers/user.mapper";
import { TCreateUserRequestDto } from "../dtos/user/user-request.dto";
import { TCreateUserCommand } from "../../../application/commands/user/user.command";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { TParamsIdDto } from "../../../core/validation/params.validation";

@injectable()
export class UserController {
  constructor(
    @inject(CONTAINER_TYPES.UserUseCases)
    public readonly userUseCases: UserUseCases,
  ) {}

  getUser = tryCatchAsync(async (req: Request<TParamsIdDto>, res: Response) => {
    const { id } = req.params;

    const user = await this.userUseCases.getUserUseCase({
      id,
    });

    const userResponse = UserMapper.toUserResponse(user);

    res.status(200).json({ success: true, data: userResponse });
  });

  getUsers = tryCatchAsync(async (_req: Request, res: Response) => {
    const users = await this.userUseCases.getUsersUseCase();

    const usersResponse = users.map((user) => UserMapper.toUserResponse(user));

    res.status(200).json({ success: true, data: usersResponse });
  });

  createUser = tryCatchAsync(async (req: Request, res: Response) => {
    const dto: TCreateUserRequestDto = req.body;

    const command: TCreateUserCommand = {
      email: dto.email,
      role: dto.role,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    };

    const user = await this.userUseCases.createUserUseCase(command);

    const userResponse = UserMapper.toUserResponse(user);

    return res.status(201).json({ success: true, data: userResponse });
  });
}
