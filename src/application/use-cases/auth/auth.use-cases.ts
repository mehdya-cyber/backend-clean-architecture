import { AppError } from "../../../core/error/app-error";
import { ITokenRepository } from "../../../domain/interfaces/token-repository.interface";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import bcrypt from "bcrypt";
import { UserEntity } from "../../../domain/entities/user/user.entity";
import {
  TLoginCommand,
  TRegisterCommand,
} from "../../commands/auth/auth.command";
import { randomUUID } from "crypto";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { JwtService } from "../../../core/utils/jwt";
import { HashService } from "../../../core/utils/hash";
import { TokenEntity } from "../../../domain/entities/token/token.entity";
import { injectable, inject } from "inversify";

@injectable()
export class AuthUseCases {
  constructor(
    @inject(CONTAINER_TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(CONTAINER_TYPES.TokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  registerUseCase = async (data: TRegisterCommand) => {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = new UserEntity({
      id: randomUUID(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: false,
      tokenVersion: 0,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await this.userRepository.save(userData);

    const familyId = HashService.randomTokenId();

    const accessToken = JwtService.signAccessToken(user);

    const refreshToken = JwtService.signRefreshToken();

    const hashToken = HashService.hashToken(refreshToken);

    const refreshTokenEntity = new TokenEntity({
      id: randomUUID(),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      updatedAt: new Date(),
      familyId,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      tokenHash: hashToken,
      replacedBy: null,
      revokedAt: null,
    });

    await this.tokenRepository.save(refreshTokenEntity);

    return {
      user,
      accessToken,
      refreshToken,
    };
  };

  loginUseCase = async (data: TLoginCommand) => {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid Credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid Credentials", 401);
    }

    const familyId = HashService.randomTokenId();

    const accessToken = JwtService.signAccessToken(user);
    const refreshToken = JwtService.signRefreshToken();

    const tokenHash = HashService.hashToken(refreshToken);

    await this.tokenRepository.save({
      id: randomUUID(),
      userId: user.id,
      familyId,
      tokenHash,
      replacedBy: null,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress ?? null,
      revokedAt: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  };

  refresh = async ({
    refreshToken,
    userAgent,
    ipAddress,
  }: {
    refreshToken: string;
    userAgent: string | null;
    ipAddress: string | null;
  }) => {
    const hashToken = HashService.hashToken(refreshToken);
    const token = await this.tokenRepository.findByTokenHash(hashToken);

    if (!token) {
      throw new AppError("Invalid refresh token", 401);
    }

    // REFRESH TOKEN REUSE DETECTION
    if (token.revokedAt) {
      await this.tokenRepository.revokeFamilyTokens(token.familyId);
      throw new AppError("Refresh token has been revoked", 401);
    }

    // EXPIRY
    if (token.expiresAt.getTime() <= Date.now()) {
      await this.tokenRepository.update(token.id, {
        revokedAt: new Date(),
      });
      throw new AppError("Refresh token has expired", 401);
    }

    const user = await this.userRepository.findById(token.userId);

    if (!user) {
      await this.tokenRepository.update(token.id, { revokedAt: new Date() });
      throw new AppError("User no longer exists", 404);
    }

    const newAccessToken = JwtService.signAccessToken(user);
    const newRefreshToken = JwtService.signRefreshToken();
    const newHashToken = HashService.hashToken(newRefreshToken);

    await this.tokenRepository.save({
      id: randomUUID(),
      userId: user.id,
      familyId: token.familyId,
      tokenHash: newHashToken,
      replacedBy: null,
      userAgent: userAgent,
      ipAddress: ipAddress ?? null,
      revokedAt: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ROTATED
    await this.tokenRepository.update(token.id, {
      revokedAt: new Date(),
      replacedBy: newHashToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  };

  logout = async ({
    refreshToken,
  }: {
    refreshToken: string;
    ipAddress: string | null;
  }) => {
    const hashToken = HashService.hashToken(refreshToken);

    const token = await this.tokenRepository.findByTokenHash(hashToken);

    if (!token) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (!token.revokedAt) {
      await this.tokenRepository.update(token.id, {
        revokedAt: new Date(),
        replacedBy: null,
      });
    }

    return true;
  };

  logoutAll = async ({ userId, ip }: { userId: string; ip: string | null }) => {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.tokenVersion++;

    await this.userRepository.update(userId, user);

    await this.tokenRepository.revokeAll(userId, ip);

    return true;
  };
}
