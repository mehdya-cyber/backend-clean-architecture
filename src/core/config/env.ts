import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const requireEnv = <T>(key: string): T => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value as T;
};

type TEnv = {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: jwt.SignOptions["expiresIn"];
  JWT_REFRESH_EXPIRES_IN: jwt.SignOptions["expiresIn"];
  CORS_ORIGIN: string;
  COOKIE_DOMAIN: string;
  CSRF_SECRET: string;
  SERVER_URL: string;
  LOG_LEVEL: "info" | "debug" | "warn" | "error";
  // REDIS_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
};

export const env: TEnv = {
  PORT: Number(requireEnv("PORT") ?? 3000),
  NODE_ENV: requireEnv("NODE_ENV") ?? "development",
  DATABASE_URL: requireEnv("DATABASE_URL"),
  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: requireEnv(
    "JWT_ACCESS_EXPIRES_IN",
  ) as jwt.SignOptions["expiresIn"],
  JWT_REFRESH_EXPIRES_IN: requireEnv(
    "JWT_REFRESH_EXPIRES_IN",
  ) as jwt.SignOptions["expiresIn"],
  CORS_ORIGIN: requireEnv("CORS_ORIGIN"),
  COOKIE_DOMAIN: requireEnv("COOKIE_DOMAIN"),
  CSRF_SECRET: requireEnv("CSRF_SECRET"),
  SERVER_URL: requireEnv("SERVER_URL"),
  LOG_LEVEL: requireEnv("LOG_LEVEL"),
  // REDIS_URL: requireEnv("REDIS_URL"),
  REDIS_HOST: requireEnv("REDIS_HOST"),
  REDIS_PORT: Number(requireEnv("REDIS_PORT")),
  REDIS_PASSWORD: requireEnv("REDIS_PASSWORD"),
};
