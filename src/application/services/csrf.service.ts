import { env } from "../../core/config/env";
import crypto from "crypto";

export class CSRFService {
  private static secret = env.CSRF_SECRET;

  static generateToken(familyId: string) {
    const numOne = crypto.randomBytes(32).toString("base64url");

    const signature = crypto
      .createHmac("sha256", this.secret)
      .update(`${familyId}.${numOne}`)
      .digest("base64url");

    return `${numOne}.${signature}`;
  }

  static verifyToken(token: string, familyId: string) {
    const [numOne, signature] = token.split(".");

    if (!numOne || !signature) return false;

    const calculatedSignature = crypto
      .createHmac("sha256", this.secret)
      .update(`${familyId}.${numOne}`)
      .digest("base64url");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature),
    );
  }
}
