import { injectable } from "inversify";
import { prisma } from "../../../../../core/config/prisma";
import {
  ITokenEntity,
  TokenEntity,
} from "../../../../../domain/entities/token/token.entity";
import { ITokenRepository } from "../../../../../domain/interfaces/token-repository.interface";
import { RefreshToken } from "../../generated/prisma/client";

@injectable()
export class TokenRepository implements ITokenRepository {
  private tokenMapper = (refreshToken: RefreshToken) => {
    return {
      id: refreshToken.id,
      userId: refreshToken.userId,
      familyId: refreshToken.familyId,
      tokenHash: refreshToken.tokenHash,
      replacedBy: refreshToken.replacedBy,
      userAgent: refreshToken.userAgent,
      ipAddress: refreshToken.ipAddress,
      revokedAt: refreshToken.revokedAt,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
      updatedAt: refreshToken.updatedAt,
    };
  };

  async save(data: TokenEntity): Promise<ITokenEntity> {
    const token = await prisma.refreshToken.create({
      data,
    });
    return this.tokenMapper(token);
  }
  async update(
    id: string,
    data: Partial<Omit<ITokenEntity, "id">>,
  ): Promise<ITokenEntity> {
    const token = await prisma.refreshToken.update({
      where: { id },
      data,
    });
    return this.tokenMapper(token);
  }

  async findByTokenHash(tokenHash: string): Promise<ITokenEntity | null> {
    const token = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    return token ? this.tokenMapper(token) : null;
  }

  async revokeAll(userId: string, replacedBy: string | null): Promise<number> {
    const user = await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: {
        revokedAt: new Date(),
        replacedBy: replacedBy,
      },
    });
    return user.count;
  }

  async revokeFamilyTokens(familyId: string): Promise<number> {
    const family = await prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: {
        revokedAt: new Date(),
      },
    });
    return family.count;
  }
}
