import { Response } from "express";
import { env } from "../config/env";

export class CookieService {
  private static isProduction = env.NODE_ENV === "production";

  private static readonly BASE_COOKIE_OPTIONS: {
    // httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax" | "strict" | boolean;
    maxAge: number;
    // domain: string;
  } = {
    // httpOnly: true,
    secure: this.isProduction,
    // domain: this.isProduction ? env.COOKIE_DOMAIN : undefined,
    sameSite: this.isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  static setRefreshToken = (res: Response, refreshToken: string) => {
    console.log(this.BASE_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, {
      ...this.BASE_COOKIE_OPTIONS,
      httpOnly: true,
      path: "/api/auth",
    });
  };

  static setCSRFToken = (res: Response, csrfToken: string) => {
    res.cookie("csrfToken", csrfToken, {
      ...this.BASE_COOKIE_OPTIONS,
      httpOnly: false,
      path: "/",
    });
  };

  static clearRefreshToken = (res: Response) => {
    res.clearCookie("refreshToken", {
      path: "/api/auth",
      httpOnly: true,
    });
  };

  static clearCSRFToken = (res: Response) => {
    res.clearCookie("csrfToken", {
      path: "/",
      httpOnly: false,
    });
  };
}
