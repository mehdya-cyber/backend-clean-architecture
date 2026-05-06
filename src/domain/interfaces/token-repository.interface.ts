import { TokenEntity } from "../entities/token/token.entity";

export interface ITokenRepository {
  save(data: TokenEntity): Promise<TokenEntity>;
  findByTokenHash(tokenHash: string): Promise<TokenEntity | null>;
  update(
    tokenHash: string,
    data: Partial<Omit<TokenEntity, "tokenHash">>,
  ): Promise<TokenEntity>;
  revokeAll(userId: string): Promise<number>;
  revokeFamilyTokens(familyId: string): Promise<number>;
}
