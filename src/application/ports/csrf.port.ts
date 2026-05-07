export interface ICsrfService {
  generateToken(familyId: string): string;
  verifyToken(token: string, familyId: string): boolean;
}
