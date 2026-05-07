import { UserEntity } from "../../domain/entities/user/user.entity";
import { TUserResponseDto } from "../http/dtos/user/user-response.dto";

export class UserMapper {
  static toUserResponse(user: UserEntity): TUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
