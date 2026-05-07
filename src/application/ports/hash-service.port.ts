export interface IHashService {
  hashToken(token: string): string;
  randomTokenId(): string;
  randomUUID(): string;
  hashPassword(password: string, saltRounds: number): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
