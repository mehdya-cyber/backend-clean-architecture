import { Response } from "express";

export class CookieService {
  private static isProduction = process.env.NODE_ENV === "production";

  private static readonly BASE_COOKIE_OPTIONS: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax" | "strict" | boolean;
    maxAge: number;
  } = {
    httpOnly: true,
    secure: this.isProduction,
    sameSite: this.isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  static setRefreshToken = (res: Response, refreshToken: string) => {
    res.cookie("refresh_token", refreshToken, this.BASE_COOKIE_OPTIONS);
  };

  static clearRefreshToken = (res: Response) => {
    res.clearCookie("refresh_token");
  };
}
