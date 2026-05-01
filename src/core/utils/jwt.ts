import jwt from "jsonwebtoken";
import { IUserEntity } from "../../domain/entities/user/user.entity";
// import { HashService } from "./hash";
import { env } from "../config/env";
import { randomUUID } from "node:crypto";

export type TAccessTokenPayload = {
  sub: string;
  role: string;
  tokenVersion: number;
};

export type TRefreshTokenPayload = {
  sub: string;
  familyId: string;
  jti: string;
  tokenVersion: number;
};

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

  static signRefreshToken(user: IUserEntity, familyId: string) {
    return jwt.sign(
      {
        sub: user.id,
        tokenVersion: user.tokenVersion,
        familyId: familyId,
        jti: randomUUID(),
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      },
    );
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  }
}
