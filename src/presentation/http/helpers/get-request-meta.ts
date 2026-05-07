import { Request } from "express";

export function getRequestMeta(req: Request) {
  return {
    ip: req.ip,
    userAgent: req.get("user-agent") || null,
  };
}
