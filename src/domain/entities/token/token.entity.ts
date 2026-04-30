export interface ITokenEntity {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  replacedBy: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  revokedAt: Date | null;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class TokenEntity implements ITokenEntity {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  replacedBy: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  revokedAt: Date | null;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data: ITokenEntity) {
    this.id = data.id;
    this.userId = data.userId;
    this.familyId = data.familyId;
    this.tokenHash = data.tokenHash;
    this.replacedBy = data.replacedBy;
    this.userAgent = data.userAgent;
    this.ipAddress = data.ipAddress;
    this.revokedAt = data.revokedAt;
    this.expiresAt = data.expiresAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
