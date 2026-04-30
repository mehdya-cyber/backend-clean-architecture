import { ITokenEntity } from "../entities/token/token.entity";

export interface ITokenRepository {
  save(data: ITokenEntity): Promise<ITokenEntity>;
  findByTokenHash(tokenHash: string): Promise<ITokenEntity | null>;
  update(
    tokenHash: string,
    data: Partial<Omit<ITokenEntity, "tokenHash">>,
  ): Promise<ITokenEntity>;
  revokeAll(userId: string, replacedBy: string | null): Promise<number>;
  revokeFamilyTokens(familyId: string): Promise<number>;
}
