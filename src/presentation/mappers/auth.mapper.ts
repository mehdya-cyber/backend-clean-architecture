import {
  TRegisterResponseDto,
  TLoginResponseDto,
} from "../http/dtos/auth/auth-response.dto";
import { IUserEntity } from "../../domain/entities/user/user.entity";

export class AuthMapper {
  static toRegisterResponse = (
    user: IUserEntity,
    token: string,
  ): TRegisterResponseDto => {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    };
  };

  static toLoginResponse = (
    user: IUserEntity,
    token: string,
  ): TLoginResponseDto => {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    };
  };
  static toRefreshResponse = (
    user: IUserEntity,
    token: string,
  ): TLoginResponseDto => {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    };
  };
}
