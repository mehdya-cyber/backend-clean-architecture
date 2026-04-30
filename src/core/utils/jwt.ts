import jwt from "jsonwebtoken";
import { IUserEntity } from "../../domain/entities/user/user.entity";
import { HashService } from "./hash";
import { env } from "../config/env";
export class JwtService {
  static signAccessToken(user: IUserEntity) {
    return jwt.sign(
      {
        sub: user.id,
        tokenVersion: user.tokenVersion,
        role: user.role,
        userId: user.id,
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      },
    );
  }

  static signRefreshToken() {
    return HashService.randomTokenId();
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  }

  // static verifyRefreshToken(token: string) {
  //   return jwt.verify(token, env.JWT_REFRESH_SECRET);
  // }
}
