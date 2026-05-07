import crypto from "crypto";
import bcrypt from "bcrypt";
import { IHashService } from "../../application/ports/hash-service.port";

export class HashService implements IHashService {
  hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  randomTokenId() {
    return crypto.randomBytes(32).toString("hex");
  }

  randomUUID() {
    return crypto.randomUUID();
  }
  async hashPassword(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
