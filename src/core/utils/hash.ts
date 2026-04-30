import crypto from "crypto";

export class HashService {
  static hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  static randomTokenId() {
    return crypto.randomBytes(32).toString("hex");
  }

  static randomUUID() {
    return crypto.randomUUID();
  }
}
