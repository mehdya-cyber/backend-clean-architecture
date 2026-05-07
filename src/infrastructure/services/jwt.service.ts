import jwt from "jsonwebtoken";
import { IUserEntity } from "../../domain/entities/user/user.entity";
import { env } from "../../core/config/env";
import { randomUUID } from "node:crypto";
import {
  IJwtService,
  TAccessTokenPayload,
  TRefreshTokenPayload,
} from "../../application/ports/jwt.port";

export class JwtService implements IJwtService {
  signAccessToken(user: IUserEntity) {
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
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      },
    );
  }

  signRefreshToken(user: IUserEntity, familyId: string) {
    return jwt.sign(
      {
        sub: user.id,
        tokenVersion: user.tokenVersion,
        familyId: familyId,
        jti: randomUUID(),
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      },
    );
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TAccessTokenPayload;
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TRefreshTokenPayload;
  }
}
