import { IUserEntity } from "../../domain/entities/user/user.entity";

// export type TAccessTokenPayload = {
//   sub: string;
//   role: string;
//   tokenVersion: number;
// };

export type TAccessTokenPayload = {
  userId: string;
  role: string;
  sub: string;
  tokenVersion: number;
  exp: number;
};

export type TRefreshTokenPayload = {
  sub: string;
  familyId: string;
  jti: string;
  tokenVersion: number;
};
export interface IJwtService {
  signAccessToken(user: IUserEntity): string;
  signRefreshToken(user: IUserEntity, familyId: string): string;
  verifyAccessToken(token: string): TAccessTokenPayload;
  verifyRefreshToken(token: string): TRefreshTokenPayload;
}
