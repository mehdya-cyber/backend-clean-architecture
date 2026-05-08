import { AppError } from "../../../core/error/app-error";
import { ITokenRepository } from "../../../domain/interfaces/token-repository.interface";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { UserEntity } from "../../../domain/entities/user/user.entity";
import {
  TLoginCommand,
  TRegisterCommand,
} from "../../commands/auth/auth.command";
import { TokenEntity } from "../../../domain/entities/token/token.entity";
import { IAuditLogRepository } from "../../../domain/interfaces/audit-log-repository.interface";
import { IJwtService } from "../../ports/jwt.port";
import { ICsrfService } from "../../ports/csrf.port";
import { IHashService } from "../../ports/hash-service.port";
import { ITransactionManager } from "../../ports/transaction-manager.port";
import { IQueueService } from "../../ports/queue-service.port";
import { TEmailJobData } from "../../jobs/email.jobs";

export class AuthUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: ITokenRepository,
    private readonly auditLogRepository: IAuditLogRepository,

    private readonly jwtService: IJwtService,
    private readonly csrfService: ICsrfService,
    private readonly hashService: IHashService,
    private readonly transactionManager: ITransactionManager,
    private readonly emailQueueService: IQueueService<TEmailJobData>,
  ) {}

  registerUseCase = async (data: TRegisterCommand) => {
    const user = await this.transactionManager.runInTransaction(async () => {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError("Email already exists", 409);
      }

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
        isActive: false,
        tokenVersion: 0,
        role: data.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await this.userRepository.save(userData);

      const familyId = this.hashService.randomTokenId();

      const accessToken = this.jwtService.signAccessToken(user);

      const refreshToken = this.jwtService.signRefreshToken(user, familyId);

      const hashToken = this.hashService.hashToken(refreshToken);

      const csrfToken = this.csrfService.generateToken(familyId);

      const refreshTokenEntity = new TokenEntity({
        id: this.hashService.randomUUID(),
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
        familyId,
        user,
        csrfToken,
        accessToken,
        refreshToken,
      };
    });

    await this.emailQueueService.add("WELCOME_EMAIL", {
      type: "WELCOME_EMAIL",
      to: data.email,
      payload: {
        name: data.firstName + " " + data.lastName,
      },
    });

    return user;
  };

  loginUseCase = async (data: TLoginCommand) => {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      await this.auditLogRepository.create({
        actorId: null,
        action: "LOGIN_FAILED",
        entity: "user",
        entityId: null,
        metadata: {
          email: data.email,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          reason: "User not found",
        },
      });
      throw new AppError("Invalid Credentials", 401);
    }

    const isPasswordValid = await this.hashService.comparePassword(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      await this.auditLogRepository.create({
        actorId: null,
        action: "LOGIN_FAILED",
        entity: "user",
        entityId: null,
        metadata: {
          email: data.email,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          reason: "Invalid password",
        },
      });
      throw new AppError("Invalid Credentials", 401);
    }

    const familyId = this.hashService.randomTokenId();

    const accessToken = this.jwtService.signAccessToken(user);
    const refreshToken = this.jwtService.signRefreshToken(user, familyId);

    const tokenHash = this.hashService.hashToken(refreshToken);

    const csrfToken = this.csrfService.generateToken(familyId);

    await this.tokenRepository.save({
      id: this.hashService.randomUUID(),
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

    await this.auditLogRepository.create({
      actorId: user.id,
      action: "LOGIN_SUCCESS",
      entity: "user",
      entityId: user.id,
      metadata: {
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    return {
      familyId,
      user,
      csrfToken,
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
    let payload;

    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }

    const hashToken = this.hashService.hashToken(refreshToken);
    const token = await this.tokenRepository.findByTokenHash(hashToken);

    if (!token) {
      await this.tokenRepository.revokeFamilyTokens(payload.familyId);
      throw new AppError("Refresh token reuse detected", 401);
    }

    if (token.userId !== payload.sub || token.familyId !== payload.familyId) {
      await this.tokenRepository.revokeFamilyTokens(payload.familyId);
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

    if (user.tokenVersion !== payload.tokenVersion) {
      await this.tokenRepository.revokeFamilyTokens(token.familyId);
      throw new AppError("Session no longer valid", 401);
    }

    const newAccessToken = this.jwtService.signAccessToken(user);
    const newRefreshToken = this.jwtService.signRefreshToken(
      user,
      token.familyId,
    );
    const newHashToken = this.hashService.hashToken(newRefreshToken);
    const newCsrfToken = this.csrfService.generateToken(token.familyId);

    await this.tokenRepository.save({
      id: this.hashService.randomUUID(),
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
      familyId: token.familyId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
      csrfToken: newCsrfToken,
    };
  };

  logout = async ({
    refreshToken,
  }: {
    refreshToken: string;
    ipAddress: string | null;
  }) => {
    const hashToken = this.hashService.hashToken(refreshToken);

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

  logoutAll = async ({ userId }: { userId: string }) => {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.tokenVersion++;

    await this.userRepository.update(userId, user);

    await this.tokenRepository.revokeAll(userId);

    return true;
  };
}
