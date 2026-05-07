export interface ICookiesService {
  setRefreshToken(refreshToken: string): void;
  setCSRFToken(csrfToken: string): void;
  clearRefreshToken(): void;
  clearCSRFToken(): void;
}
